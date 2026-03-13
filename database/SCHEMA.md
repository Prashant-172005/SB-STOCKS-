# SB-STOCKS · MongoDB Schema Reference

## Collections

### users
| Field      | Type     | Description                        |
|------------|----------|------------------------------------|
| _id        | ObjectId | Auto-generated                     |
| username   | String   | Unique, min 3 chars                |
| email      | String   | Unique, lowercase                  |
| password   | String   | bcrypt hashed, not returned        |
| role       | String   | "user" \| "admin"                  |
| balance    | Number   | Virtual trading balance (default $10,000) |
| isActive   | Boolean  | Account status                     |
| createdAt  | Date     | Auto timestamp                     |

### orders
| Field         | Type     | Description                     |
|---------------|----------|---------------------------------|
| _id           | ObjectId | Auto-generated                  |
| userId        | ObjectId | Ref: users                      |
| stockSymbol   | String   | e.g. "AAPL"                     |
| stockName     | String   | e.g. "Apple Inc."               |
| exchange      | String   | "NASDAQ" \| "NYSE"              |
| orderType     | String   | "buy" \| "sell"                 |
| productType   | String   | "Intraday" \| "Delivery"        |
| quantity      | Number   | Number of shares                |
| pricePerShare | Number   | Price at order time             |
| totalAmount   | Number   | quantity × pricePerShare        |
| status        | String   | "Completed" \| "Pending" ...    |
| createdAt     | Date     | Auto timestamp                  |

### portfolios
| Field           | Type     | Description                   |
|-----------------|----------|-------------------------------|
| _id             | ObjectId | Auto-generated                |
| userId          | ObjectId | Ref: users                    |
| stockSymbol     | String   | Uppercase, e.g. "NVDA"        |
| stockName       | String   |                               |
| exchange        | String   |                               |
| quantity        | Number   | Current shares held           |
| averageBuyPrice | Number   | Weighted avg buy price        |
| totalInvested   | Number   | quantity × avgBuyPrice        |
| updatedAt       | Date     | Auto timestamp                |

### transactions
| Field       | Type     | Description                      |
|-------------|----------|----------------------------------|
| _id         | ObjectId | Auto-generated                   |
| userId      | ObjectId | Ref: users                       |
| type        | String   | "Deposit" \| "Withdraw"          |
| amount      | Number   | In dollars                       |
| paymentMode | String   | IMPS / Net Banking / UPI / NEFT  |
| status      | String   | "Completed" \| "Pending"         |
| createdAt   | Date     | Auto timestamp                   |
