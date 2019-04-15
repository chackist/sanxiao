var config = {
	Key:{
		GamePlay:"Key_GamePlay",
		GameBestRecord0:"Key_GameBestRecord0",
		GameBestRecord1:"Key_GameBestRecord1",
		GameBestRecord2:"Key_GameBestRecord2",
	}

	Logic:{
		Type0:{
			BaseGuanQiaNeedScore:1000,
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

		Type3:{
			BaseGuanQiaNeedScore:1000,
			PreGuanQiaAddScore:100,
			GuanQiaTime:-1,
			WinCoinBase:1000,
			WinScoreExchangeCoin:20 / 1,//赢的分兑换金币
		}
	}

	PropPrice:{
		Del:300,
		AddStep:300,
		Help:1000,
	}
}