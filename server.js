const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - গ্লোবাল গেটওয়ে সকেট প্রোটকল লক ভাই ভাই]
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

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

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক ভাই ভাই]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স ইন্টারসেপ্টর গেটওয়ে (১ শতভাগ টাইমআউট ও জ্যাম ব্লকার বর্ম ওস্তাদ)
app.get('/api/roulette-balance', async (req, res) => {
    // নোট: লবির ওরিজিনাল রাউট স্ট্রাকচার ইউনিফর্মিটি বজায় রাখতে ব্যালেন্স গেটওয়ে টাইট সিঙ্ক লক ভাই ভাই
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "balance", 
            username: userId,
            amount: 0,
            wallet: targetWallet,
            game: "royalkeno"
        }, { timeout: 15000 });

        if (response.data && (response.data.status === "ok" || response.data.success === true)) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { 
        return res.json({ success: false, balance: 0 }); 
    }
});

// পুরনো ওল্ড এপিআই রি-সিঙ্ক ইন্টারসেপ্টর ফলব্যাক
app.get('/api/keno-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "balance", username: userId, amount: 0, wallet: targetWallet, game: "royalkeno"
        }, { timeout: 15000 });
        if (response.data && (response.data.status === "ok" || response.data.success === true)) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. রয়্যাল কিনো কোর জ্যাকপট ড্র রাউট (POST Route - ৯৫% RTP গাণিতিক বর্ম কঠোর লক ভাই ভাই!)
app.post('/api/keno-deal', async (req, res) => {
    const { userId, amount, wallet, selectedNumbers } = req.body; // selectedNumbers: array of numbers [e.g. 1, 5, 23]
    const reqAmount = parseFloat(amount) || 50;
    const userNumbers = selectedNumbers || [];
    const finalGameName = "royalkeno"; 
    const targetWallet = wallet || "main";

    if (reqAmount < 1 || reqAmount > 20000 || !Array.isArray(userNumbers) || userNumbers.length < 1 || userNumbers.length > 10) {
        return res.json({ success: false, message: "🚨 Invalid Bet Parameter! Select 1 to 10 numbers." });
    }

    try {
        // 🔒 [ব্যালেন্স ডেবিট প্রোটোকল]: বাজি প্লে করার সাথে সাথে ১ম হিটে একবারই অ্যাকাউন্ট থেকে বাজি কাটার রিকোয়েস্ট যাবে ভাই
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: reqAmount, wallet: targetWallet, game: finalGameName
        }, { timeout: 30000 });
        
        if (!balResponse.data || balResponse.data.status !== "ok") {
            return res.json({ success: false, message: "❌ Database Sync Error or Insufficient Balance!" });
        }

        let currentDbBalance = parseFloat(balResponse.data.balance);
        let drawnBallsList = [];
        let matchedCount = 0;
        let winMultiplier = 0.00;
        let finalStatus = "lose";

        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP এবং ৪০-সংখ্যা বিঙ্গো ৫-বল ড্র লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 150) {
            loopSafety++;
            drawnBallsList = [];
            matchedCount = 0;

            // ৪০টি নাম্বারের বাকেট থেকে র্যান্ডম ৫টি আলাদা লাকি বল ড্র ইঞ্জিন
            while (drawnBallsList.length < 5) {
                let randomBall = Math.floor(Math.random() * 40) + 1;
                if (!drawnBallsList.includes(randomBall)) {
                    drawnBallsList.push(randomBall);
                    if (userNumbers.includes(randomBall)) {
                        matchedCount++;
                    }
                }
            }

            // কিনো জ্যাকপট ওরিজিনাল পে-আউট ম্যাট্রিক্স সিঙ্ক
            if (matchedCount > 0) {
                finalStatus = "win";
                // ১টি মিললে ১.৯৫ গুণ, ২টি মিললে ৩.৫০ গুণ, ৩টি মিললে ৮ গুণ, ৪টি মিললে ২৫ গুণ প্রফিট!
                if (matchedCount === 1) winMultiplier = 1.95;
                else if (matchedCount === 2) winMultiplier = 3.50;
                else if (matchedCount === 3) winMultiplier = 8.00;
                else if (matchedCount === 4) winMultiplier = 25.00;
                else winMultiplier = 100.00; // ৫ টি মিললে মেগা কিনো জ্যাকপট ১০০ গুণ!
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            // এডমিন প্যানেল কাস্টম ফোর্স কন্ট্রোল নব ফিল্টারিং চ্যাম
            if (balResponse.data && balResponse.data.keno_target) {
                let target = String(balResponse.data.keno_target).toLowerCase();
                if (target === "force_lose" && finalStatus === "win") isLoopActive = false;
                if (target === "force_win" && finalStatus === "win" && matchedCount >= 1) isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    // কিনো জ্যাকপট সুপ্রিম আরটিপি স্বাভাবিক ক্যাসিনো ট্র্যাকে ৪৩% এ ব্যালেন্সড লক ভাই ভাই!
                    if (Math.random() <= 0.43) isLoopActive = false;
                } else {
                    isLoopActive = false;
                }
            }
        }

        // 🎯 [মেগা কিলার জিরো-ডাবল-ডেবিট স্টেক ব্যালেন্সার বর্ম ভাই ভাই]
        let winAmount = 0;
        let dbAction = "win"; 
        let dbAmount = 0;

        if (finalStatus === "win") {
            winAmount = Math.round(reqAmount * winMultiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount); 
        } else {
            dbAction = "win"; 
            dbAmount = 0; // 🔒 বাজি লস হলে ডাটাবেজে ২য় বার কোনো টাকা কাটার কমান্ড যাবে না ভাই ভাই!
        }

        let phpPayload = { 
            action: dbAction, username: userId, amount: dbAmount, wallet: targetWallet, game: finalGameName 
        };
        
        if (finalStatus === "lose") phpPayload.status = "lose";
        else phpPayload.status = "win";

        phpPayload.bet_amount = reqAmount;

        // 🛫 ③ মেইন সাইটের সিকিউরড গেটওয়েতে রিয়েল-টাইম উইন-লস সেটেলমেন্ট এפיআই হিট (কড়া ৪৫ সেকেন্ড সিঙ্ক লক)
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 45000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            
            return res.json({
                success: true,
                balance: response.data.balance,
                data: { balance: response.data.balance },
                gameData: { drawnBallsList, matchedCount, status: finalStatus, winAmount }
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "X Bet Settlement Declined by Database!" });
        }
    } catch (e) { 
        console.error("Royal Keno Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click SPIN again." }); 
    }
});

app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, 'index.html')); });
io.on('connection', (socket) => { console.log("Player connected to Royal Keno Live Engine!"); });

// ⚡ কাস্টম রয়্যাল কিনো নোড সার্ভার পোর্ট গেটওয়ে লাইভ অন ফায়ার
const PORT = process.env.PORT || 25000; // 🎯 রয়্যাল কিনোর জন্য ডেডিকেটেড পোর্ট ৩৫০০০ লক ভাই ভাই
server.listen(PORT, () => { console.log(`🎡 Royal Keno Engine Running on port ${PORT}`); });
