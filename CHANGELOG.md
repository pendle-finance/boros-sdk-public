# Changelog

## 0.1.0 — Initial public release

- First public release of the Boros SDK targeting open-api-v2.
- `Exchange` class wrapping placeOrder / bulkPlaceOrders / cancelOrders / deposit / withdraw / payTreasury / cashTransfer.
- Cursor-paginated reads: `getOrdersPage`, `getMarkets`, `getMarketsByIds`, plus `getAllMarkets` (cached).
- Contract-side reads: `getActiveOrdersFromContract`, `getUserPositions`.
- Agent lifecycle: `Agent.create`, `Exchange.approveAgent`, `Exchange.getAgentExpiryTime`.
- Escape hatch: `getOpenApiSdk()` returns the codegen client for raw open-api-v2 access.
