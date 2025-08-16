"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const sales_routes_1 = __importDefault(require("./modules/sales/sales.routes"));
const service_routes_1 = __importDefault(require("./modules/service/service.routes"));
const inventory_routes_1 = __importDefault(require("./modules/inventory/inventory.routes"));
const customer_routes_1 = __importDefault(require("./modules/customer/customer.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Auth and user management routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/sales', sales_routes_1.default);
app.use('/api/service', service_routes_1.default);
app.use('/api/inventory', inventory_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// TODO: Add routes for auth, sales, service, inventory, customer, analytics
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
