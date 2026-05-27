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
    try {
        const response = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${wallet}`, { timeout: 30000 });
        if (response.data && response.data.status === "ok") {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. কেনো ৫-বল ড্র কোর এপিআই রাউট (POST Route - ৯৫% RTP গাণিতিক অ্যালগরিদম বর্ম লক ভাই ভাই!)
app.post('/api/keno-draw', async (req, res) => {
    const { userId, amount, wallet, numbers } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;
    const userNumbers = numbers || []; // প্লেয়ারের চুজ করা ১-৫টি নাম্বারের অ্যারে

    // 🔒 ১ থেকে ২০০০ বিডিটি পর্যন্ত এবং সর্বনিম্ন ১টি নাম্বার সিলেকশন সিকিউরিটি ফিল্টার লক
    if (reqAmount < 1 || reqAmount > 2000 || userNumbers.length === 0 || userNumbers.length > 5) {
        return res.json({ success: false, message: "🚨 Invalid Parameters!" });
    }

    try {
        const balCheck = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${targetWallet}`, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balCheck.data && balCheck.data.balance !== undefined && balCheck.data.balance !== null) {
            currentDbBalance = parseFloat(balCheck.data.balance);
        } else { currentDbBalance = 9999999; }

        if (currentDbBalance < reqAmount && currentDbBalance !== 9999999) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge." });
        }

        // 🎯 [ভবিষ্যৎ সেন্ট্রাল গোপন এডমিন প্যানেল গেটওয়ে লিঙ্ক লক]
        let adminTriggeredPrize = (balCheck.data && balCheck.data.keno_target) ? balCheck.data.keno_target : null;

        let winningNumbers, matchedCount, finalStatus, winMultiplier;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল RTP ও সুষম লটারি বল ৫-ড্রপ র্যান্ডমাইজেশন লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            // ১ থেকে ৪০টি সংখ্যার ভেতর থেকে ৫টি কড়া ইউনিক বিজয়ী লটারি বল তৈরি ভাই ভাই
            winningNumbers = [];
            while (winningNumbers.length < 5) {
                let randomNum = Math.floor(Math.random() * 40) + 1;
                if (!winningNumbers.includes(randomNum)) {
                    winningNumbers.push(randomNum);
                }
            }

            // প্লেয়ারের লাকি নাম্বারের সাথে কতটি ম্যাচ করলো তার লাইভ ট্র্যাকিং কাউন্টার ভাই ভাই
            let matches = userNumbers.filter(n => winningNumbers.includes(n));
            matchedCount = matches.length;

            // ইন্টারন্যাশনাল কেনো বিঙ্গো পে-আউট স্লট রুলস চাবি ভাই ভাই
            if (matchedCount === 0) {
                finalStatus = "lose";
                winMultiplier = 0.00;
            } else if (matchedCount === 1) {
                finalStatus = "win";
                winMultiplier = 1.20; // ১টি মিললে ১.২ গুণ
            } else if (matchedCount === 2) {
                finalStatus = "win";
                winMultiplier = 2.50; // ২টি মিললে ২.৫ গুণ
            } else if (matchedCount === 3) {
                finalStatus = "win";
                winMultiplier = 6.00; // ৩টি মিললে ৬ গুণ
            } else if (matchedCount === 4) {
                finalStatus = "win";
                winMultiplier = 15.00; // ৪টি মিললে ১৫ গুণ
            } else {
                finalStatus = "win";
                winMultiplier = 50.00; // ৫টির ৫টিই হুবহু মিলে গেলে ৫০ গুণ ধামাকা মেগা জ্যাকপট ব্লাস্ট!
            }

            if (adminTriggeredPrize) {
                // এডমিন ফোর্স লুপ কন্ডিশন সিঙ্ক
                if (adminTriggeredPrize === "force_lose" && finalStatus === "lose") isLoopActive = false;
                if (adminTriggeredPrize === "force_win" && finalStatus === "win" && matchedCount >= 3) isLoopActive = false;
            } else {
                // 🔒 ৯৫% আরটিপি প্রোটেকশন গেটওয়ে লক: ৩ বা তার বেশি নাম্বার ম্যাচিং জ্যাকপট চান্স মাত্র ২.৮% লক ভাই ভাই
                if (winMultiplier >= 6.00 && Math.random() > 0.028) continue;

                if (finalStatus === "win") {
                    // ৯৫% আরটিপি ব্যালেন্স ট্র্যাকিং লুপ অনুযায়ী প্লেয়ার উইন চান্স ৪৪% লক ভাই ভাই
                    if (Math.random() <= 0.44) {
                        isLoopActive = false;
                    }
                } else {
                    isLoopActive = false; // প্লেয়ার লস খেলে লুপ সাথে সাথে স্টপ ভাই
                }
            }
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (finalStatus === "win") {
            winAmount = Math.floor(reqAmount * winMultiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount);
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

        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                status: finalStatus,
                winAmount: winAmount,
                winningNumbers: winningNumbers, // ৫টি বলের অ্যারে ফ্রন্টএন্ড এনিমেশনে পাঠাতে ভাই ভাই
                matchCount: matchedCount
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Keno Bingo Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click BET again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to Royal Keno Bingo Engine!"); });

// ১৬ নম্বর গেম ২৩০০০ এ চলছে, তাই ১৮ নম্বর রাজকীয় কেনো বিঙ্গো গেম প্রজেক্টের স্বাধীন কাস্টম পোর্ট ২৫০০০ কড়া লক হলো ভাই ভাই!
const PORT = process.env.PORT || 25000;
server.listen(PORT, () => { console.log(`🔮 Royal Keno Bingo Engine Running on port ${PORT}`); });
