// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FanPredix is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TEAM_ROLE = keccak256("TEAM_ROLE");

    uint256 public platformFeePercentage;
    address public treasury;

    // Storage
    enum OrderType { Back, Lay }
    enum MarketStatus { Open, Closed, Resolved }

    struct Team {
        uint256 id;
        string name;
        address teamManager;
        address fanToken;
    }

    struct Market {
        uint256 id;
        uint256 teamId;
        address teamManager;
        address fanToken;
        string category;
        string question;
        string description;
        string[] options;
        uint256 startTime;
        uint256 endTime;
        MarketStatus status;
        uint256 resolvedOutcomeIndex;
    }

    struct Order {
        uint256 id;
        uint256 marketId;
        address user;
        uint256 outcomeIndex;
        OrderType orderType;
        uint256 amount;
        uint256 odds;
        bool isMatched;
    }

    struct Bet {
        uint256 id;
        uint256 marketId;
        address user;
        uint256 outcomeIndex;
        uint256 amount;
        uint256 odds;
        OrderType orderType;
    }

    mapping(uint256 => Team) public teams;
    mapping(address => uint256) public teamManagerToTeamId;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => Bet) public bets;

    uint256 public teamCounter;
    uint256 public marketCounter;
    uint256 public orderCounter;
    uint256 public betCounter;

    mapping(uint256 => mapping(uint256 => mapping(OrderType => Order[]))) public marketOrders;
    mapping(uint256 => mapping(address => uint256[])) public userBets;
    mapping(uint256 => uint256[]) public teamMarkets;

    constructor(uint256 _platformFeePercentage, address _treasury) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        platformFeePercentage = _platformFeePercentage;
        treasury = _treasury;
    }

    function addTeam(string memory _name, address _teamManager, address _fanToken) external onlyRole(ADMIN_ROLE) {
        require(teamManagerToTeamId[_teamManager] == 0, "Team already exists");
        teamCounter++;
        teams[teamCounter] = Team(teamCounter, _name, _teamManager, _fanToken);
        teamManagerToTeamId[_teamManager] = teamCounter;
        _grantRole(TEAM_ROLE, _teamManager);
    }

    function updateTeam(string memory _name, address _fanToken) external onlyRole(TEAM_ROLE) {
        uint256 teamId = teamManagerToTeamId[msg.sender];
        require(teamId != 0, "Team does not exist");
        teams[teamId].name = _name;
        teams[teamId].fanToken = _fanToken;
    }

    function createMarket(
        string memory _category,
        string memory _question,
        string memory _description,
        string[] memory _options,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyRole(TEAM_ROLE) returns (uint256) {
        require(_startTime > block.timestamp && _endTime > _startTime, "Invalid times");
        uint256 teamId = teamManagerToTeamId[msg.sender];
        require(teamId != 0, "Team does not exist");

        marketCounter++;
        markets[marketCounter] = Market({
            id: marketCounter,
            teamId: teamId,
            teamManager: msg.sender,
            fanToken: teams[teamId].fanToken,
            category: _category,
            question: _question,
            description: _description,
            options: _options,
            startTime: _startTime,
            endTime: _endTime,
            status: MarketStatus.Open,
            resolvedOutcomeIndex: 0
        });

        teamMarkets[teamId].push(marketCounter);
        return marketCounter;
    }

    function placeOrder(
        uint256 _marketId,
        uint256 _outcomeIndex,
        OrderType _orderType,
        uint256 _amount,
        uint256 _odds
    ) external returns (uint256) {
        Market storage market = markets[_marketId];
        require(market.id != 0, "Market does not exist");
        require(block.timestamp >= market.startTime && block.timestamp < market.endTime, "Market not open");
        require(_outcomeIndex < market.options.length, "Invalid outcome index");

        IERC20 fanToken = IERC20(market.fanToken);
        require(fanToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        orderCounter++;
        Order memory newOrder = Order({
            id: orderCounter,
            marketId: _marketId,
            user: msg.sender,
            outcomeIndex: _outcomeIndex,
            orderType: _orderType,
            amount: _amount,
            odds: _odds,
            isMatched: false
        });

        orders[orderCounter] = newOrder;
        marketOrders[_marketId][_outcomeIndex][_orderType].push(newOrder);

        _tryMatchOrder(newOrder);

        return orderCounter;
    }

    function cancelOrder(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(order.user == msg.sender, "Not order owner");
        require(!order.isMatched, "Order already matched");

        Market storage market = markets[order.marketId];
        require(market.status == MarketStatus.Open, "Market not open");

        IERC20 fanToken = IERC20(market.fanToken);
        require(fanToken.transfer(msg.sender, order.amount), "Transfer failed");

        order.isMatched = true; // Mark as matched to prevent further operations
    }

    function resolveMarket(uint256 _marketId, uint256 _resolvedOutcomeIndex) external onlyRole(TEAM_ROLE) {
        Market storage market = markets[_marketId];
        require(market.teamManager == msg.sender, "Not authorized");
        require(block.timestamp >= market.endTime, "Market not ended");
        require(market.status == MarketStatus.Open, "Market already resolved");
        require(_resolvedOutcomeIndex < market.options.length, "Invalid outcome index");

        market.status = MarketStatus.Resolved;
        market.resolvedOutcomeIndex = _resolvedOutcomeIndex;
    }

    function redeemWinnings(uint256 _marketId) external {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Resolved, "Market not resolved");

        uint256[] storage userBetIds = userBets[_marketId][msg.sender];
        uint256 totalWinnings = 0;

        for (uint256 i = 0; i < userBetIds.length; i++) {
            Bet storage bet = bets[userBetIds[i]];
            if (bet.outcomeIndex == market.resolvedOutcomeIndex) {
                if (bet.orderType == OrderType.Back) {
                    totalWinnings += bet.amount * bet.odds / 1000;
                } else {
                    totalWinnings += bet.amount;
                }
            }
        }

        if (totalWinnings > 0) {
            uint256 fee = totalWinnings * platformFeePercentage / 10000;
            uint256 payout = totalWinnings - fee;

            IERC20 fanToken = IERC20(market.fanToken);
            require(fanToken.transfer(msg.sender, payout), "Payout transfer failed");
            require(fanToken.transfer(treasury, fee), "Fee transfer failed");
        }

        delete userBets[_marketId][msg.sender];
    }

    function _tryMatchOrder(Order memory newOrder) internal {
        Market storage market = markets[newOrder.marketId];
        OrderType oppositeType = newOrder.orderType == OrderType.Back ? OrderType.Lay : OrderType.Back;
        Order[] storage oppositeOrders = marketOrders[newOrder.marketId][newOrder.outcomeIndex][oppositeType];

        for (uint256 i = 0; i < oppositeOrders.length && !newOrder.isMatched; i++) {
            Order storage oppositeOrder = oppositeOrders[i];
            if (!oppositeOrder.isMatched && newOrder.odds == oppositeOrder.odds) {
                uint256 matchedAmount = _min(newOrder.amount, oppositeOrder.amount);
                _createBet(newOrder, matchedAmount);
                _createBet(oppositeOrder, matchedAmount);

                newOrder.amount -= matchedAmount;
                oppositeOrder.amount -= matchedAmount;

                if (oppositeOrder.amount == 0) {
                    oppositeOrder.isMatched = true;
                }
                if (newOrder.amount == 0) {
                    newOrder.isMatched = true;
                }
            }
        }
    }

    function _createBet(Order memory order, uint256 amount) internal {
        betCounter++;
        bets[betCounter] = Bet({
            id: betCounter,
            marketId: order.marketId,
            user: order.user,
            outcomeIndex: order.outcomeIndex,
            amount: amount,
            odds: order.odds,
            orderType: order.orderType
        });
        userBets[order.marketId][order.user].push(betCounter);
    }

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    // Query functions

    function getTeam(uint256 _teamId) external view returns (Team memory) {
        return teams[_teamId];
    }

    function getMarket(uint256 _marketId) external view returns (Market memory) {
        return markets[_marketId];
    }

    function getOrder(uint256 _orderId) external view returns (Order memory) {
        return orders[_orderId];
    }

    function getBet(uint256 _betId) external view returns (Bet memory) {
        return bets[_betId];
    }

    function getMarketOrders(uint256 _marketId, uint256 _outcomeIndex, OrderType _orderType) external view returns (Order[] memory) {
        return marketOrders[_marketId][_outcomeIndex][_orderType];
    }

    function getUserBets(uint256 _marketId, address _user) external view returns (uint256[] memory) {
        return userBets[_marketId][_user];
    }

    function getMarketsByTeam(uint256 _teamId) external view returns (uint256[] memory) {
        return teamMarkets[_teamId];
    }

    function getAllTeams() external view returns (Team[] memory) {
        Team[] memory allTeams = new Team[](teamCounter);
        for (uint256 i = 1; i <= teamCounter; i++) {
            allTeams[i - 1] = teams[i];
        }
        return allTeams;
    }
}