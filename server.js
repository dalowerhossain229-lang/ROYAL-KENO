const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - মেগা সকেট প্রোটোকল লক]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/keno-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. ক্যানো কোর লটারি ড্র রাউট (POST Route - ৯৫% RTP ও ১.৯৫ ওডস স্কেলিং বর্ম কঠোর লক ভাই ভাই!)
app.post('/api/keno-spin', async (req, res) => {
    const { userId, amount, wallet, pickedNumbers } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;
    
    // প্লেয়ারের সিলেক্ট করা নম্বরের অ্যারে (১-৪০ এর মধ্যে)
    const userPickedArray = Array.isArray(pickedNumbers) ? pickedNumbers : [];

    // 🔒 [বেট সিকিউরিটি ফিল্টার]: বাজি ১ টাকার কম বা ২০০০০ টাকার বেশি হলে ব্যাকএন্ড ডিরেক্ট ব্লক ভাই ভাই!
    if (reqAmount < 1 || reqAmount > 20000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳Subcontinent)" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই প্রোটোকল]: বাজি প্লে করার আগে ডাটাবেজ থেকে রিয়েল টাকা নিশ্চিত করার চাবি
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balResponse.data && balResponse.data.status === "ok" && balResponse.data.balance !== undefined) {
            currentDbBalance = parseFloat(balResponse.data.balance);
        } else {
            return res.json({ success: false, balance: 0, message: "❌ Database Sync Error! Please refresh." });
        }

        // 🔒 [ইনসাফিসিয়েন্ট প্রোটেকশন বর্ম]: অ্যাকাউন্টে টাকা কম থাকলে বা জিরো ব্যালেন্স হলে বাজি রিফিউজড ভাই ভাই!
        if (currentDbBalance < reqAmount || currentDbBalance <= 0) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge BDT." });
        }

        let adminTriggeredPrize = (balResponse.data && balResponse.data.keno_target) ? balResponse.data.keno_target : null;

        let luckyNumbers, matchCount, finalStatus, winMultiplier;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP ও ক্যানো লটারি ড্র লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            // ১ থেকে ৪০ এর মধ্য থেকে ৫টি সম্পূর্ণ ইউনিক লাকি লটারি নম্বর জেনারেটর
            luckyNumbers = [];
            while (luckyNumbers.length < 5) {
                let num = Math.floor(Math.random() * 40) + 1;
                if (!luckyNumbers.includes(num)) luckyNumbers.push(num);
            }

            // প্লেয়ারের কতটি নাম্বার হুবহু লটারির সাথে মিলেছে তার গণনা (HIT COUNT)
            matchCount = userPickedArray.filter(n => luckyNumbers.includes(n)).length;

            if (matchCount > 0) {
                finalStatus = "win";
                // 🚀 [১.৯৫ ক্যানো ওডস ম্যাট্রিক্স চাবি]: ক্যানোর ম্যাচিং কাউন্ট অনুযায়ী সুষম ১.৯৫ প্রফিট স্কেলিং লক ভাই ভাই!
                if (matchCount === 1) winMultiplier = 1.95;
                else if (matchCount === 2) winMultiplier = 3.50;
                else if (matchCount === 3) winMultiplier = 6.00;
                else if (matchCount === 4) winMultiplier = 15.00;
                else winMultiplier = 40.00; // ৫টি নাম্বারই হুবহু মিলে গেলে জ্যাকপট ৪০ গুণ রিটার্ন!
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            // এডমিন ড্যাশবোর্ড কন্ট্রোল ট্রিগার চাবি
            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && finalStatus === "lose") isLoopActive = false;
                if (adminTriggeredPrize === "force_win" && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    // ৯৫% আরটিপি সিঙ্ক কন্ট্রোল ম্যাথ লুপ স্বাভাবিক ট্র্যাকে ৩৬% এ ব্যালেন্সড লক ভাই ভাই!
                    if (Math.random() <= 0.36) {
                        isLoopActive = false;
                    }
                } else {
                    isLoopActive = false; 
                }
            }
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (finalStatus === "win") {
            // দশমিক ভগ্নাংশ জ্যাম এড়াতে পারফেক্ট টু-ফিক্সড ডেটা পাস ভাই ভাই
            winAmount = parseFloat((reqAmount * winMultiplier).toFixed(2));
            dbAction = "win";
            dbAmount = winAmount;
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = winMultiplier.toFixed(2);
            phpPayload.status = "win";
            phpPayload.type = "win";
            phpPayload.is_win = 1;
            phpPayload.win_status = "win";
            phpPayload.log_status = "win";
        }

        // ডাটাবেজে ফাইনাল বাজি ডেবিট-ক্রেডিট কল ভাই ভাই
        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                status: finalStatus,
                winAmount: winAmount,
                luckyNumbers: luckyNumbers,
                result: matchCount
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Royal Keno Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click SPIN again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to Royal Keno Engine!"); });

// রয়্যাল ক্যানো গেম নিজস্ব কাস্টম ৪০০০ পোর্টে কড়া নিয়নে অন ফায়ার ভাই ভাই!
const PORT = process.env.PORT || 25000; 
server.listen(PORT, () => { console.log(`🎡 Royal Keno Engine Running on port ${PORT}`); });
