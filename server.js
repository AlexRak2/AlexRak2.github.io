const express = require('express');
const app = express();
const port = 8383;

app.use(express.static('public'))

app.get('/getData', (req, res) => {
    res.status(200).json({
        PumpCount: 3,
        Pump1Stat: 3,
        Pump2Stat: 2,
        Pump3Stat: 1,
        Level: 4.2,
        Flow: 31
    })
})

app.listen(port, () => console.log('server started on port: ' + port))