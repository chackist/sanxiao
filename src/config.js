var config = {
	Key:{
		GamePlay:"Key_GamePlay",
		Coin:"Key_Coin",
		GameBestRecord0:"Key_GameBestRecord0",
		GameBestRecord1:"Key_GameBestRecord1",
		GameBestRecord2:"Key_GameBestRecord2",
	},

	Event:{
		OneStep:"OneStep",
		ChangeSelect:"ChangeSelect",
	},

	Logic:{
		Type0:{
			BaseGuanQiaNeedScore:100,
			PreGuanQiaAddScore:100,
			GuanQiaTime:60,
			WinCoinBase:1000,
			WinScoreExchangeCoin:20 / 1,//赢的分兑换金币
		},

		Type1:{
			BaseGuanQiaNeedScore:[50,60,80,100],
			PreGuanQiaAddScore:5,
			AllStep:20,
			WinCoinBase:1000,
			WinScoreExchangeCoin:20 / 1,//赢的分兑换金币
		},

		Type2:{
			BaseGuanQiaNeedScore:1000,
			PreGuanQiaAddScore:1000,
			GuanQiaTime:-1,
			WinCoinBase:1000,
			WinScoreExchangeCoin:20 / 1,//赢的分兑换金币
		}
	},

	PropPrice:{
		Del:300,
		AddStep:300,
		Help:1000,
	},

    Items: [{
        Bg: "res/sanxiao/N.png",
        Frame: "res/sanxiao/m4.png",
        LineColor: cc.color(0, 179, 65)
    },  {
        Bg: "res/sanxiao/H.png",
        Frame: "res/sanxiao/m3.png",
        LineColor: cc.color(254, 152, 0)
    },{
        Bg: "res/sanxiao/L.png",
        Frame: "res/sanxiao/m2.png",
        LineColor: cc.color(0, 160, 233)
    }, {
        Bg: "res/sanxiao/M.png",
        Frame: "res/sanxiao/m1.png",
        LineColor: cc.color(229, 0, 79)
    }],

}