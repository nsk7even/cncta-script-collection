// ==UserScript==
// @name            Next MCV Info HUD
// @description     Displays a tiny HUD with remaining resource informations for being able to create a new MCV (Mobile Construction Vehicle) = new base
// @author          7even + Maelstrom (MaelstromTools Dev) + Eistee (WarChiefs - Tiberium Alliances Sector HUD)
// @version         1.0 beta
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
/**
 *  License: GPL v3
 */
(function ()
{
	var injectFunction = function ()
	{
		function createClasses()
		{
			qx.Class.define("InfoHUD",
			{
				type: "singleton",
				extend: qx.core.Object,
				destruct: function () {},

				construct: function ()
				{
					console.log("Init ...");

					this.SectorText = new qx.ui.basic.Label("").set(
					{
						textColor : "#FFFFFF",
						font : "font_size_11"
					});

					this.HUD = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set(
					{
						decorator : new qx.ui.decoration.Decorator().set(
						{
							backgroundRepeat : "no-repeat",
							backgroundImage : "webfrontend/ui/menues/notifications/bgr_ticker_container.png",
							backgroundPositionX : "center"
						}),
						padding : 2,
						opacity: 0.8
					});

					this.HUD.setToolTipText('Click to Toggle View');
					this.HUD.addListener("click", function (e)
					{
						if (e.getButton() == "left") null;
						if (e.getButton() == "right") null;
					}, this);

					//this.HUD.add(this.SectorText);

					this.__refresh = false;
					qx.core.Init.getApplication().getDesktop().add(this.HUD, {left: 128, top: 20});
					this.run_UpdateTimer();
					//phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), "PositionChange", ClientLib.Vis.PositionChange, this, this._update);

					console.log("Init complete");
				},

				members:
				{
					__refresh: null,
					SectorText: null,
					mcvTimerLabel: null,
					mcvCreditProcentageLabel: null,
					mcvResearchTimerLabel: null,
					mcvplace: null,
					HUD: null,

					get_FormatNumbersCompact: function(i)
					{
						if (i >= 1000000000)
						{
							return (i / 1000000000).toFixed(2) + "G";
						}

						if (i >= 1000000)
						{
							return (i / 1000000).toFixed(2) + "M";
						}

						if (i >= 1000)
						{
							return (i / 1000).toFixed(2) + "K";
						}

						return i;
					},

					get_Padded: function(i, d = 2)
					{
						return i.toLocaleString('en-US', {minimumIntegerDigits: d, useGrouping:false})
					},

					run_UpdateTimer: function ()
					{
						try
						{
							this._update();

							var self = this;
							setTimeout(function ()
							{
								self.run_UpdateTimer();
							}, 10000);
						}
						catch (e)
						{
							console.log("MaelstromTools.runSecondlyTimer: ", e);
						}
					},

					_update: function ()
					{
						if (this.__refresh === false) {
							this.__refresh = true;
							setTimeout(this.__update.bind(this), 500);
						}
					},

					__update: function ()
					{
						try
						{
							var McvCostItems = this.get_NextMcvCosts();
							this.HUD.removeAll();

							for (i in McvCostItems)
							{
							  this.HUD.add(McvCostItems[i])
							}
						}
						catch (e)
						{
							console.log("Next MCV Info HUD - Update Error: ", e);
						}
						finally
						{
							this.__refresh = false;
						}
					},

					get_NextMcvCosts: function ()
					{
						try
						{
							var player = ClientLib.Data.MainData.GetInstance().get_Player();
							var cw = player.get_Faction();
							var cj = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound, cw);
							var cr = player.get_PlayerResearch();
							var cd = cr.GetResearchItemFomMdbId(cj);

							if (cd == null)
							{
								return "Error: no cd";
							}

							// this.mcvPopup.addListener("minimize",function(e) {
							// 	if(this.extMinimized) {
							// 		this.extMinimized = false;
							// 		this.mcvPopup.remove(this.mcvplace);
							// 		for(var k in this.extItems) this.mcvPopup.add(this.extItems[k]);
							// 	}
							// 	else
							// 	{
							// 		this.extMinimized = true;
							// 		this.mcvPopup.removeAll();
							// 		this.mcvPopup.add(this.mcvplace);
							// 	}
							// 	this.mcvPopup.restore();//trick
							// },this);

							var font1 = qx.bom.Font.fromString('bold').set({	size: 12	});
							var font2 = qx.bom.Font.fromString('bold').set({	size: 12	});
							var font3 = qx.bom.Font.fromString('bold').set({	size: 12	});
							var font4 = qx.bom.Font.fromString('bold').set({	size: 12	});

							this.mcvTimerLabel = new qx.ui.basic.Label().set(
								{
									font: font1,
									textColor: 'cyan',
									width: 150,
									allowGrowX: true,
									textAlign: 'center',
									marginBottom : 0,
									rich:true
								});

							this.mcvCreditProcentageLabel = new qx.ui.basic.Label().set(
								{
									font: font2,
									textColor: 'yellow',
									width: 150,
									allowGrowX: true,
									textAlign: 'center',
									marginBottom : 0,
									rich:true
								});

							this.mcvResearchTimerLabel = new qx.ui.basic.Label().set(
								{
									font: font3,
									textColor: 'yellow',
									width: 150,
									allowGrowX: true,
									textAlign: 'center',
									marginBottom : 0,
									rich:true
								});

							this.mcvplace = new qx.ui.basic.Label().set(
								{
									width: 100,
									font: font4,
									textColor: 'yellow',
									textAlign: 'center',
									rich:true,
									marginBottom : 0
								});

							var serverBar = qx.core.Init.getApplication().getServerBar().getBounds();
							var nextLevelInfo = cd.get_NextLevelInfo_Obj();
							var resourcesNeeded = [];

							for (var i in nextLevelInfo.rr)
							{
								if (nextLevelInfo.rr[i].t > 0)
								{
									resourcesNeeded[nextLevelInfo.rr[i].t] = nextLevelInfo.rr[i].c;
								}
							}

							var researchNeeded = resourcesNeeded[ClientLib.Base.EResourceType.ResearchPoints];
							var currentResearchPoints = player.get_ResearchPoints();
							XY = 100 / researchNeeded
							XYX = currentResearchPoints
							PercentageOfResearchPoints = XYX * XY
							//PercentageOfResearchPoints = 150.23
							var creditsNeeded = resourcesNeeded[ClientLib.Base.EResourceType.Gold];
							var creditsResourceData = player.get_Credits();
							var creditGrowthPerHour = (creditsResourceData.Delta + creditsResourceData.ExtraBonusDelta) * ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
							var creditDelta = creditsNeeded - player.GetCreditsCount();
							var creditTimeHours = creditDelta / creditGrowthPerHour;
							var creditTimeMins = Math.abs(((Math.trunc(creditTimeHours % 24) - creditTimeHours % 24) * 60));
							var creditTimeSecs = Math.trunc(Math.abs(Math.trunc(creditTimeMins) - creditTimeMins) * 60);
							var creditTime = Math.trunc(creditTimeHours / 24) + "." + this.get_Padded(Math.trunc(creditTimeHours % 24)) + ":" + this.get_Padded(Math.trunc(creditTimeMins)) + ":" + this.get_Padded(creditTimeSecs);
							var ZX = 100 / creditsNeeded;
							var ZXZ = player.GetCreditsCount();
							var PercentageOfCredits = ZXZ * ZX
							//PercentageOfCredits = ZXZ * 1% of ZX

							if (creditTimeHours > 0)
							{
								this.mcvTimerLabel.setValue("TIMER C$ - " + creditTime);
							}
							else
							{
								this.mcvTimerLabel.setValue("TIMER C$ - OFF");
							}

							if (PercentageOfCredits >= 100)
							{
								this.mcvCreditProcentageLabel.setValue("<span style='color: #92ff7f;'>CREDIT - OK!</span> <span style='color: #ff8f00;'>" +this.get_FormatNumbersCompact(ZXZ) + "</span> / <span style='font-size:12px;'>" + this.get_FormatNumbersCompact(creditsNeeded) + "</span>");
								this.mcvplace.setValue("<span style='color: #92ff7f;'>C$ (+" + this.get_FormatNumbersCompact(Math.abs(creditsNeeded-ZXZ)) + ")</span>");
							}

							if (PercentageOfCredits < 100)
							{
								this.mcvCreditProcentageLabel.setValue("<span style='color: #ff8a7f;'>CREDIT</span> -  <span style='color: #ff8f00;'>" + this.get_FormatNumbersCompact(creditsNeeded-ZXZ) + "</span> / <span style='font-size:12px;'>" +this.get_FormatNumbersCompact(creditsNeeded) + " @ " + (PercentageOfCredits).toFixed(1) + "%</span>");
								this.mcvplace.setValue("<span style='color: #ff8a7f;'>T$ - "  + creditTime + "</span>");
							}

							if (PercentageOfResearchPoints >= 100)
							{
								this.mcvResearchTimerLabel.setValue("<span style=' color: #92ff7f;'>RP - OK!</span> <span style='color: #ff8f00;'>" +this.get_FormatNumbersCompact(XYX) + "</span> / <span style='font-size:12px;'>" + this.get_FormatNumbersCompact(researchNeeded) + ")</span>");
								this.mcvplace.setValue(this.mcvplace.$$user_value + "<br><span style='color: #92ff7f;'>RP (+" +this.get_FormatNumbersCompact(Math.abs(researchNeeded-currentResearchPoints)) + ")</span>");
							}

							if (PercentageOfResearchPoints < 100)
							{
								this.mcvResearchTimerLabel.setValue("<span style='color: #ff8a7f;'>RP - </span><span style='color: #ff8f00;'>" + this.get_FormatNumbersCompact(researchNeeded-currentResearchPoints) + "</span> /<span style='font-size:12px;'> " +this.get_FormatNumbersCompact(researchNeeded) + " @ " + (PercentageOfResearchPoints).toFixed(1) + "%</span>");
								this.mcvplace.setValue(this.mcvplace.$$user_value + "<br><span style='color: #ff8a7f;'>RP (@" + (PercentageOfResearchPoints).toFixed(1) + "%)</span>");
							}

							var extItems=[];
							extItems.push(this.mcvplace);
							// extItems.push(this.mcvTimerLabel);
							// extItems.push(this.mcvCreditProcentageLabel);
							// extItems.push(this.mcvResearchTimerLabel);

							return extItems;
						}
						catch (e)
						{
							console.log("get_NextMcvCosts", e);
						}
					}
				}
			});
		}

		function waitForGame()
		{
			try
			{
				if (typeof qx !== "undefined" && typeof qx.core !== "undefined" && typeof qx.core.Init !== "undefined" && typeof ClientLib !== "undefined" && typeof phe !== "undefined")
				{
					var app = qx.core.Init.getApplication();
					if (app.initDone === true)
					{
						try
						{
							console.group("Next MCV Info HUD");
							console.time("loaded in");
							createClasses();
							InfoHUD.getInstance();
							console.timeEnd("loaded in");
							console.groupEnd();
						}
						catch (e)
						{
							console.group("Next MCV Info HUD");
							console.error("Error in waitForGame", e);
							console.groupEnd();
						}
					}
					else
						window.setTimeout(waitForGame, 1000);
				}
				else
				{
					window.setTimeout(waitForGame, 1000);
				}
			}
			catch (e)
			{
				console.group("Next MCV Info HUD");
				console.error("Error in waitForGame", e);
				console.groupEnd();
			}
		}

		window.setTimeout(waitForGame, 1000);
	};

	var script = document.createElement("script");
	var txt = injectFunction.toString();
	script.innerHTML = "(" + txt + ")();";
	script.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(script);
})();
