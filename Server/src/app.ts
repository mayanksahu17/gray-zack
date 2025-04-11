import express, { Express, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Express = express();

const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gray-zack-113j.vercel.app',
  'https://gray-zack.vercel.app',
  'https://8tvnlx2t-3000.inc1.devtunnels.ms'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.use(express.static("public"));
app.use(cookieParser());
app.use((req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });

    next();
});

app.use((req, res, next) => {
    const startTime = Date.now(); 

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });

    next();
});

app.get('/')
import adminRouter from './routes/administratorRoutes/admin.route'
import hotelAdminRouter from './routes/admin.hotel.route'
import staffRouter from './routes/staff.route'
import restaurantRouter from './routes/restaurant.route'
// import orderRouter from './routes/order.route'
import roomRoutes from './routes/room.routes'
import guestRoutes from './routes/guest.route'
import paymentRoutes from "./routes/payment.route"
import invoiceRouter from './routes/invoice.route'
import reservationRoutes from './routes/reservation.route'
app.use('/api/v1.0/admin',adminRouter)
app.use('/api/v1/admin/hotels', hotelAdminRouter)
app.use('/api/v1/staff/hotel', staffRouter)
app.use('/api/v1/room', roomRoutes)
app.use('/api/v1/admin/hotel/restaurant', restaurantRouter)
app.use('/api/restaurants', restaurantRouter)
// app.use('/api/orders', orderRoutes)
app.use('/api/v1/guest', guestRoutes)
app.use('/api/v1/payment', paymentRoutes)
app.use('/api/v1/invoice', invoiceRouter)
app.use('/api/v1/reservation', reservationRoutes)



























// import roomRouter from './routes/room.routes'
// app.use('/api/v1/admin/hotel',hotelRouter)
// app.use()
// app.use('hii',async ( res : Response) => {
//     res.status(200).json({
//         message : "hii"
//     })
// })


export { app };
