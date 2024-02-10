const express = require('express');
const app = express();
const MyError = require('./myError');

app.get('/mean', function (req, res) {
    if (!req.query.nums) {
        throw new MyError('nums must be provided in the query', 400);
    }
    const nums = req.query.nums.split(',');
    if (nums.some(num => isNaN(num))) {
        throw new MyError('nums must be a list of numbers', 400);
    }

    const mean = nums.reduce((acc, val) => acc + Number(val), 0) / nums.length;
    return res.json({ operation: 'mean', value: mean });
});

app.get('/median', function (req, res) {
    if (!req.query.nums) {
        throw new MyError('nums must be provided in the query', 400);
    }
    const nums = req.query.nums.split(',');
    if (nums.some(num => isNaN(num))) {
        throw new MyError('nums must be a list of numbers', 400);
    }

    nums.sort((a, b) => a - b);
    let median;
    if (nums.length % 2 === 0) {
        median = (Number(nums[nums.length / 2 - 1]) + Number(nums[nums.length / 2])) / 2;
    } else {
        median = nums[Math.floor(nums.length / 2)];
    }
    return res.json({ operation: 'median', value: median });
});

app.get('/mode', function (req, res) {
    if (!req.query.nums) {
        throw new MyError('nums must be provided in the query', 400);
    }
    const nums = req.query.nums.split(',');

    if (nums.some(num => isNaN(num))) {
        throw new MyError('nums must be a list of numbers', 400);
    }

    const counts = nums.reduce((acc, val) => {
        if (acc[val]) {
            acc[val]++;
        } else {
            acc[val] = 1;
        }
        return acc;
    }, {});

    let maxCount = 0;
    let modeVal = null;
    for (const num in counts) {
        if (counts[num] > maxCount) {
            maxCount = counts[num];
            modeVal = num;
        }
    }

    return res.json({ operation: 'mode', value: modeVal });
});

app.use(function (err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({ error: { message, status } });
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});