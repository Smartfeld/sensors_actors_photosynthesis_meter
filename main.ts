input.onButtonPressed(Button.A, function () {
    new_file = 1
})
function switchFan (state: boolean) {
    if (state) {
        pins.digitalWritePin(DigitalPin.P0, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P0, 0)
    }
}
function switchPump (state: boolean) {
    if (state) {
        statePump = 1
        pins.digitalWritePin(DigitalPin.P1, 1)
    } else {
        statePump = 0
        pins.digitalWritePin(DigitalPin.P1, 0)
    }
}
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    serialData = serial.readLine()
})
radio.onReceivedString(function (receivedString) {
    if (receivedString.includes("pump-on")) {
        music.playTone(262, music.beat(BeatFraction.Whole))
        switchPump(true)
    }
    if (receivedString.includes("pump-off")) {
        music.playTone(277, music.beat(BeatFraction.Whole))
        switchPump(false)
    }
    if (receivedString.includes("fan-on")) {
        music.playTone(294, music.beat(BeatFraction.Whole))
        switchFan(true)
    }
    if (receivedString.includes("fan-off")) {
        music.playTone(311, music.beat(BeatFraction.Whole))
        switchFan(false)
    }
    if (receivedString.includes("light-on")) {
        music.playTone(330, music.beat(BeatFraction.Whole))
        stateLight = 1
        switchPig.switchPlug(MyEnumPlugLabel.K1, MyEnumState.ON)
    }
    if (receivedString.includes("light-off")) {
        music.playTone(349, music.beat(BeatFraction.Whole))
        stateLight = 0
        switchPig.switchPlug(MyEnumPlugLabel.K1, MyEnumState.OFF)
    }
    if (receivedString.includes("new_file")) {
        music.playTone(370, music.beat(BeatFraction.Whole))
        new_file = 1
        switchPig.switchPlug(MyEnumPlugLabel.K1, MyEnumState.OFF)
    }
})
radio.onReceivedValue(function (name, value) {
    if (name.includes("time")) {
        zeitintervallDatenSendenInCloud = value
    }
})
let serialData = ""
let statePump = 0
let zeitintervallDatenSendenInCloud = 0
let new_file = 0
let stateLight = 0
switchPump(false)
serial.setBaudRate(BaudRate.BaudRate115200)
serial.setRxBufferSize(200)
serial.setTxBufferSize(200)
serial.redirect(
SerialPin.P2,
SerialPin.P16,
BaudRate.BaudRate9600
)
basic.showIcon(IconNames.Heart)
switchPig.selectRfGroupID(MyEnumGroupIDs.Schlau)
switchPig.switchPlug(MyEnumPlugLabel.K1, MyEnumState.OFF)
stateLight = 0
new_file = 0
zeitintervallDatenSendenInCloud = 5000
basic.forever(function () {
    serial.writeValue("co2", SCD30.readCO2())
    serial.writeValue("hum", SCD30.readHumidity())
    serial.writeValue("temp", SCD30.readTemperature())
    serial.writeValue("pump", statePump)
    serial.writeValue("light", stateLight)
    serial.writeValue("new_file", new_file)
    new_file = 0
    basic.pause(zeitintervallDatenSendenInCloud)
})
