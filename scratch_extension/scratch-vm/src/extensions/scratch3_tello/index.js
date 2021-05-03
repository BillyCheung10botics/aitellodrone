const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';

const message = {
    streamon: {
        'ja': "stream video",
        'ja-Hira': "stream video",
        'en': "stream video"
    },
    emergency: {
        'ja': "emergency stop",
        'ja-Hira': "emergency stop",
        'en': "emergency stop"
    },
    connect: {
        'ja': 'connect',
        'ja-Hira': 'connect',
        'en': 'connect'
    },
    takeoff: {
        'ja': '離陸する',
        'ja-Hira': 'りりくする',
        'en': 'takeoff'
    },
    land: {
        'ja': '着陸する',
        'ja-Hira': 'ちゃくりくする',
        'en': 'land'
    },
    stay: {
        'ja': 'stay',
        'ja-Hira': 'stay',
        'en': 'stay'
    },
    remotecontrol: {
        'ja': '鴐駛 左右:[LR]% 前後:[FB]% 上下:[UD]% 🔄:[YAW]%',
        'ja-Hira': 'drive x:[LR]% y:[FB]% z:[UD]% 🔄:[YAW]%',
        'en': 'drive x:[LR]% y:[FB]% z:[UD]% 🔄:[YAW]%'
    },
    drive: {
        'ja': '鴐駛 [DIR] [VAL]%',
        'en': 'drive [DIR] [VAL]%'
    },
    flip: {
        'ja': '反 [DIR]',
        'ja-Hira': '反 [DIR]',
        'en': 'flip [DIR]'
    },
    speed: {
        'ja': '速 [X]cm/s',
        'ja-Hira': '速 [X] cm/s',
        'en': 'set speed [X] cm/s'
    },
    left: {
        'ja': '左',
        'ja-Hira': 'ひだり',
        'en': 'left ⇐'
    },
    right: {
        'ja': '右',
        'ja-Hira': 'みぎ',
        'en': 'right ⇒'
    },
    forward: {
        'ja': '前',
        'ja-Hira': 'まえ',
        'en': 'forward ⊙'
    },
    backward: {
        'ja': '後ろ',
        'ja-Hira': 'うしろ',
        'en': 'backward ⊗'
    },
    up: {
        'ja': '上',
        'en': 'up ⇑'
    },
    down: {
        'ja': '下',
        'en': 'down ⇓'
    },
    clockwise: {
        'ja': '正旋',
        'en': 'clockwise ↺'
    },
    anticlockwise: {
        'ja': '負旋',
        'en': 'anticlockwise ↻'
    },
    moveup: {
        'ja': '上に [X]cm 上がる',
        'ja-Hira': 'うえに [X] センチあがる',
        'en': 'move up [X] cm'
    },
    movedown: {
        'ja': '下に [X]cm 下がる',
        'ja-Hira': 'したに [X] センチさがる',
        'en': 'move down [X] cm'
    },
    moveleft: {
        'ja': '左に [X]cm 動く',
        'ja-Hira': 'ひだりに [X] センチうごく',
        'en': 'move left [X] cm'
    },
    moveright: {
        'ja': '右に [X]cm 動く',
        'ja-Hira': 'みぎに [X] センチうごく',
        'en': 'move right [X] cm'
    },
    moveforward: {
        'ja': '前に [X]cm 進む',
        'ja-Hira': 'まえに [X] センチすすむ',
        'en': 'move forward [X] cm'
    },
    moveback: {
        'ja': '後ろに [X]cm 下がる',
        'ja-Hira': 'うしろに [X] センチさがる',
        'en': 'move backward [X] cm'
    },
    cw: {
        'ja': '[X] 度右に回る',
        'ja-Hira': '[X] どみぎにまわる',
        'en': 'rotate [X] degrees right'
    },
    ccw: {
        'ja': '[X] 度左に回る',
        'ja-Hira': '[X] どひだりにまわる',
        'en': 'rotate [X] degrees left'
    },
    pitch: {
        'ja': 'ピッチ',
        'ja-Hira': 'ピッチ',
        'en': 'pitch'
    },
    roll: {
        'ja': 'ロール',
        'ja-Hira': 'ロール',
        'en': 'roll'
    },
    yaw: {
        'ja': 'ヨー',
        'ja-Hira': 'ヨー',
        'en': 'yaw'
    },
    vgx: {
        'ja': 'x方向の速度',
        'ja-Hira': 'xほうこうのはやさ',
        'en': 'speed x'
    },
    vgy: {
        'ja': 'y方向の速度',
        'ja-Hira': 'yほうこうのはやさ',
        'en': 'speed y'
    },
    vgz: {
        'ja': 'z方向の速度',
        'ja-Hira': 'zほうこうのはやさ',
        'en': 'speed z'
    },
    tof: {
        'ja': '地面からの高度',
        'ja-Hira': 'じめんからのたかさ',
        'en': 'height from ground'
    },
    height: {
        'ja': '離陸した場所からの高度',
        'ja-Hira': 'りりくしたばしょからのたかさ',
        'en': 'height from takeoff point'
    },
    bat: {
        'ja': 'バッテリー残量',
        'ja-Hira': 'バッテリーざんりょう',
        'en': 'battery remaining'
    },
    baro: {
        'ja': '気圧計による高さ',
        'ja-Hira': 'きあつけいによるたかさ',
        'en': 'height by barometer'
    },
    time: {
        'ja': '飛行時間',
        'ja-Hira': 'ひこうじかん',
        'en': 'flying time'
    },
    agx: {
        'ja': 'x方向の加速度',
        'ja-Hira': 'xほうこうのかそくど',
        'en': 'acceleration x'
    },
    agy: {
        'ja': 'y方向の加速度',
        'ja-Hira': 'yほうこうのかそくど',
        'en': 'acceleration y'
    },
    agz: {
        'ja': 'z方向の加速度',
        'ja-Hira': 'zほうこうのかそくど',
        'en': 'acceleration z'
    }

};

/**
 * Class for the Tello
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3Tello {


    get FLIP_DIRECTION_MENU () {
        return [
            {
                text: message.right[this.locale],
                value: 'r'
            },
            {
                text: message.left[this.locale],
                value: 'l'
            },
            {
                text: message.forward[this.locale],
                value: 'f'
            },
            {
                text: message.backward[this.locale],
                value: 'b'
            }
        ]
    }

    get DRIVE_DIRECTION_MENU () {
        return [
            {
                text: message.right[this.locale],
                value: 'r'
            },
            {
                text: message.left[this.locale],
                value: 'l'
            },
            {
                text: message.forward[this.locale],
                value: 'f'
            },
            {
                text: message.backward[this.locale],
                value: 'b'
            },
            {
                text: message.up[this.locale],
                value: 'u'
            },
            {
                text: message.down[this.locale],
                value: 'd'
            },
            {
                text: message.clockwise[this.locale],
                value: 'c'
            },
            {
                text: message.anticlockwise[this.locale],
                value: 'a'
            }
        ]
    }

    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.state = {};
        this.getState();
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        if (formatMessage.setup().locale === 'ja' || formatMessage.setup().locale === 'ja-Hira') {
            this.locale = formatMessage.setup().locale;
        } else {
            this.locale = 'en';
        }

        return {
            id: 'tello',
            name: 'Tello',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'connect',
                    text: message.connect[this.locale],
                    blockType: BlockType.COMMAND,
                    func: 'telloconnect'
                },
                {
                    opcode: 'emergency',
                    text: message.emergency[this.locale],
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'takeoff',
                    text: message.takeoff[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'land',
                    text: message.land[this.locale],
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'stay',
                    text: message.stay[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'speed',
                    text: message.speed[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },

                // {
                //     opcode: 'remotecontrol',
                //     text: message.remotecontrol[this.locale],
                //     blockType: BlockType.COMMAND,
                //     arguments: {
                //         LR: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         },
                //         FB: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         },
                //         UD: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         },
                //         YAW: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         }
                //     }
                // },
                {
                    opcode: 'driverc',
                    text: message.drive[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'driveDirectionMenu', 
                            defaultValue: "r"
                        },
                        VAL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'flip',
                    text: message.flip[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'flipDirectionMenu', 
                            defaultValue: "r"
                        }
                    }
                },
                {
                    opcode: 'up',
                    text: message.moveup[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'down',
                    text: message.movedown[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'left',
                    text: message.moveleft[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'right',
                    text: message.moveright[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'forward',
                    text: message.moveforward[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'back',
                    text: message.moveback[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'cw',
                    text: message.cw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'ccw',
                    text: message.ccw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'streamon',
                    text: message.streamon[this.locale],
                    blockType: BlockType.COMMAND,
                },
                // '---',
                // {
                //     opcode: 'pitch',
                //     text: message.pitch[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'roll',
                //     text: message.roll[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'yaw',
                //     text: message.yaw[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'vgx',
                //     text: message.vgx[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'vgy',
                //     text: message.vgy[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'vgz',
                //     text: message.vgz[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'tof',
                //     text: message.tof[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'height',
                //     text: message.height[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                {
                    opcode: 'bat',
                    text: message.bat[this.locale],
                    blockType: BlockType.REPORTER
                },
                // {
                //     opcode: 'baro',
                //     text: message.baro[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'time',
                //     text: message.time[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'agx',
                //     text: message.agx[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'agy',
                //     text: message.agy[this.locale],
                //     blockType: BlockType.REPORTER
                // },
                // {
                //     opcode: 'agz',
                //     text: message.agz[this.locale],
                //     blockType: BlockType.REPORTER
                // }
            ],
            menus: {
                flipDirectionMenu: {
                    acceptReporters: false,
                    items: this.FLIP_DIRECTION_MENU
                },
                driveDirectionMenu: {
                    acceptReporters: false,
                    items: this.DRIVE_DIRECTION_MENU
                }
                
            }
        };
    }

    getState () {
        setInterval(() => {
            telloProcessor.state().then(response => {
                this.state = JSON.parse(response);
            });
        }, 100);
    }

    streamon (args) {
        telloProcessor.send(`streamon`);
    }

    telloconnect () {
        telloProcessor.connect();
    }

    emergency () {
        telloProcessor.emergency();
    }

    takeoff () {
        telloProcessor.send('takeoff');
    }

    land () {
        telloProcessor.send('land');
    }

    remotecontrol (args) {
        console.log("run scratch rc")
        telloProcessor.rc(args.LR, args.FB, args.UD, args.YAW)
    }

    driverc (args) {
        const direction = args.DIR;
        const value = args.VAL;
        if (value > 100) {
            value = 100;
        } else if (value < 0) {
            value = 0;
        }
        switch (direction) {
            case 'r':
                telloProcessor.rc_lr(value)
                break; 
            case 'l':
                telloProcessor.rc_lr(-value)
                break;
            case 'f':
                telloProcessor.rc_fb(value)
                break;  
            case 'b':
                telloProcessor.rc_fb(-value)
                break;  
            case 'u':
                telloProcessor.rc_ud(value)
                break;  
            case 'd':
                telloProcessor.rc_ud(-value)
                break;  
            case 'c':
                telloProcessor.rc_yaw(value)
                break;  
            case 'a':
                telloProcessor.rc_yaw(-value)
                break;  
            default:
                break; 
        }
    }

    stay () {
        telloProcessor.rc(0, 0, 0, 0);
        // telloProcessor.send("stop");
    }

    speed (args) {
        telloProcessor.send(`speed ${Cast.toString(Math.floor(args.X))}`);
    }

    flip (args) {
        telloProcessor.send(`flip ${args.DIR}`);
    }

    up (args) {
        telloProcessor.send(`up ${Cast.toString(Math.floor(args.X))}`);
    }

    down (args) {
        telloProcessor.send(`down ${Cast.toString(Math.floor(args.X))}`);
    }

    left (args) {
        telloProcessor.send(`left ${Cast.toString(Math.floor(args.X))}`);
    }

    right (args) {
        telloProcessor.send(`right ${Cast.toString(Math.floor(args.X))}`);
    }

    forward (args) {
        telloProcessor.send(`forward ${Cast.toString(Math.floor(args.X))}`);
    }

    back (args) {
        telloProcessor.send(`back ${Cast.toString(Math.floor(args.X))}`);
    }

    cw (args) {
        telloProcessor.send(`cw ${Cast.toString(Math.floor(args.X))}`);
    }

    ccw (args) {
        telloProcessor.send(`ccw ${Cast.toString(Math.floor(args.X))}`);
    }

    pitch () {
        return this.state.pitch;
    }

    roll () {
        return this.state.roll;
    }

    yaw () {
        return this.state.yaw;
    }

    vgx () {
        return this.state.vgx;
    }

    vgy () {
        return this.state.vgy;
    }

    vgz () {
        return this.state.vgz;
    }

    tof () {
        return this.state.tof;
    }

    height () {
        return this.state.h;
    }

    bat () {
        return this.state.bat;
    }

    baro () {
        return this.state.baro;
    }

    time () {
        return this.state.time;
    }

    agx () {
        return this.state.agx;
    }

    agy () {
        return this.state.agy;
    }

    agz () {
        return this.state.agz;
    }
}
module.exports = Scratch3Tello;
