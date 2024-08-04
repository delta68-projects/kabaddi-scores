"use strict";


var rounds = 3;
var i = 0;
$(function () {
	var handle = $("#teams-handle");
	$("#teamslider").slider({
		min: 1, // min value
		max: 5, // max value
		step: 1,
		value: rounds,
		create: function () {
			handle.text(Math.pow(2, rounds));
		},
		slide: function (event, ui) {
			rounds = ui.value;
			updateNrOfRounds(rounds);

		}
	});
});

function updateNrOfRounds(roundok) {
	rounds = roundok;
	$("#teamslider").slider('value', rounds);
	$("#teams-handle").text(Math.pow(2, rounds));
	$("#wrapTournament").removeClass();
	$("#wrapTournament").addClass("show" + Math.pow(2, rounds));
	if (rounds > 4) {
		$("#wrapTournament").addClass('narrow');
	}
	if (rounds == 1) {
		$("#showrounds").css("opacity", 0.3);
	} else {
		$("#showrounds").css("opacity", 1);
	}
	updateGameNrs();
	$("#savedLink").fadeOut(300);
}

function updateGameNrs() {
	var game = 0;
	for (i = 1; i < 6; i++) {
		$(".down input.team").each(function () {
			if ($(this).parent().attr("data-r") == i) {		// oszloponkent halad
				if (Math.round($(this).parent().parent().index() / 2) < Math.pow(2, rounds) / 2) {
					game++;
					if (!isNaN($(this).parent().find("input.info").val()) && (Number($(this).parent().find("input.info").val()) < 32)) {
						$(this).parent().find("input.info").val(game);
					}
				}
			}
		});
	}
}
function convertData(input) {
	// Helper function to convert string to object
	function parseJsonString(jsonString) {
	  try {
		// Replace single quotes with double quotes and parse JSON
		return JSON.parse(jsonString.replace(/'/g, '"'));
	  } catch (error) {
		console.error("Failed to parse JSON string:", jsonString);
		return {};
	  }
	}
  
	
	  return {
		...input,
		round1: parseJsonString(input.round1),
		round2: parseJsonString(input.round2),
		round3: parseJsonString(input.round3),
		round4: parseJsonString(input.round4),
		scores: parseJsonString(input.scores)
	  };
	
  }

function demo_game_stats(stats){
	console.log("Updating demo game stats");
	console.log(typeof(stats));
	// stats = convertData(stats)
	


	updateNrOfRounds(3);

	// Round 1
	$("#home1-1").val(stats.round1.home1);
	$("#visitor1-1").val(stats.round1.visitor1);
	$("#home1-2").val(stats.round1.home2);
	$("#visitor1-2").val(stats.round1.visitor2); 
	$("#home1-3").val(stats.round1.home3); 
	$("#visitor1-3").val(stats.round1.visitor3);
	$("#home1-4").val(stats.round1.home4); 
	$("#visitor1-4").val(stats.round1.visitor4);
	
	// Round 2
	$("#home2-1").val(stats.round2.home1); 
	$("#visitor2-1").val(stats.round2.visitor1); 
	$("#home2-2").val(stats.round2.home2); 
	$("#visitor2-2").val(stats.round2.visitor2); 
	
	// Round 3
	$("#home3-1").val(stats.round3.home1); 
	$("#visitor3-1").val(stats.round3.visitor1); 
	
	// Winner
	$("#home4-1").val(stats.round4.winner); 
	    


    $("#title").val(stats.title);

    $("#hs1-1").val(stats.scores.hs1_1);
    $("#vs1-1").val(stats.scores.vs1_1);
    $("#hs1-2").val(stats.scores.hs1_2);
    $("#vs1-2").val(stats.scores.vs1_2);
    $("#hs1-3").val(stats.scores.hs1_3);
    $("#vs1-3").val(stats.scores.vs1_3);
    $("#hs1-4").val(stats.scores.hs1_4);
    $("#vs1-4").val(stats.scores.vs1_4);

    $("#hs2-1").val(stats.scores.hs2_1);
    $("#vs2-1").val(stats.scores.vs2_1);
    $("#hs2-2").val(stats.scores.hs2_2);
    $("#vs2-2").val(stats.scores.vs2_2);

    $("#hs3-1").val(stats.scores.hs3_1);
    $("#vs3-1").val(stats.scores.vs3_1);

	updateWinners();
}


$(document).ready(function () {

	if (window.location.href.includes("?")) {
		$("#wrapSettings").hide();
		$("body").addClass("hideMenu");
	} else {
		$("#wrapSettings").show();
	}

	$("input.team").each(function () {
		$(this).parent().attr("data-r", ($(this).parent().index() + 1) / 2);	// r - round	o - hanyadik meccs abban a roundban

	});
	$("input.info").each(function () {
		$(this).attr("id", 've' + $(this).parent().parent().attr("data-r") + '-' + $(this).parent().parent().attr("data-o"));
	});

	$(".down input.team").each(function () {
		$(this).attr("id", 'home' + $(this).parent().attr("data-r") + '-' + $(this).parent().attr("data-o"));
	});
	$(".up input.team").each(function () {
		$(this).attr("id", 'visitor' + $(this).parent().attr("data-r") + '-' + $(this).parent().attr("data-o"));
	});
	$(".down input.score").each(function () {
		$(this).attr("id", 'hs' + $(this).parent().attr("data-r") + '-' + $(this).parent().attr("data-o"));
		$(this).attr("data-pair", 'vs' + $(this).parent().attr("data-r") + '-' + $(this).parent().attr("data-o"));
	});
	$(".up input.score").each(function () {
		$(this).attr("id", 'vs' + $(this).parent().attr("data-r") + '-' + $(this).parent().attr("data-o"));
		$(this).attr("data-pair", 'hs' + $(this).parent().attr("data-r") + '-' + $(this).parent().attr("data-o"));
	});

	$(".final input").each(function () {
		$(this).attr("id", 'winner' + $(this).parent().parent().index());
	});
	$(".first input").each(function () {
		i++;
		$(this).val(i);
	});

	i = 0;
	updateGameNrs();

	$(".checkbox").click(function () {
		$("#savedLink").fadeOut(300);
		$(this).toggleClass("active");

		var idje = $(this).attr("id");

		if (idje == "ordered") {
			$("#tournament").toggleClass('ordered');
		}
		if (idje == "showscore") {
			$("body").toggleClass('hidescore');
		}
		if (idje == "showrounds") {
			$(".rounds").fadeToggle(300);
		}
		if (idje == "toggleTitle") {
			$("#title").fadeToggle(300).focus();
		}
		if (idje == "hlwinner") {
			$("#tournament").toggleClass('showwinner');
		}

		if (idje == "showvenue") {
			$("#tournament").toggleClass('showvenue');
			if (window.innerWidth > 1025) {
				$(".row1 input.info").focus();
			}
		}
		if (idje == "finalwinner") {
			$("#tournament").toggleClass('hiddenfinalwinner');
		}

	});

	$("#tournament > div > div > span").click(function () {
		$("#" + $(this).attr("data-t")).val($(this).parent().prev().find("input.team").val());
		updateWinners();
		$(this).parent().prev().removeClass("loser").addClass("winner");
		$("#" + $(this).parent().prev().find("input.score").attr("data-pair")).parent().removeClass("winner").addClass("loser");	//az elozo winner-t leszedi
		$("#savedLink").fadeOut(300);
	});

	$("#home2-1, #home3-1, #home4-1, #home5-1").change(function () {
		updateWinners();
	});

	$("input.team").focus(function () {
		$(this).parent().next().addClass("focused");
	});
	$("input.team").focusout(function () {
		$("#tournament > div > div").removeClass("focused");
	});

	$("input.team").bind("keyup change", function (e) {
		$("#savedLink").fadeOut(300);
	});
	$("input.score").bind("keyup change", function (e) {
		$("#savedLink").fadeOut(300);
		var ez = $(this).val();
		if (ez == "") { ez = 0; }
		if (isNaN(ez)) {
			$(this).addClass('error');
		} else {
			$(this).parent().removeClass("winner loser");
			$("#" + $(this).attr("data-pair")).parent().removeClass("winner loser");

			$(this).removeClass('error');
			ez = Number(ez);

			var az = $("#" + $(this).attr("data-pair")).val();
			if (ez == "") { ez = 0; }
			if (!isNaN(az)) {
				az = Number(az);
				if ((ez != az) && ($(this).val() != "") && ($("#" + $(this).attr("data-pair")).val() != "")) {
					if (ez > az) {
						if ($("#autoadvance").hasClass("active")) {		// auto advance
							var csapat = $(this).parent().find("input.team").val();	// Csapat neve
							var desztinacio = "#" + $(this).parent().next().find("span").attr("data-t");	// Desztinacio input
							$(desztinacio).val(csapat);
						}
					} else {
						if ($("#autoadvance").hasClass("active")) {		// auto advance

							var csapat = $("#" + $(this).attr("data-pair")).prev().val();	// Csapat neve
							var desztinacio = "#" + $(this).parent().next().find("span").attr("data-t");	// Desztinacio input

							//console.log(desztinacio, csapat);
							$(desztinacio).val(csapat);
						}
					}
				}
			}

		}
		updateWinners();
	});


	if (window.innerWidth > 1025) {
		$(".row1 input.team").focus();
		setTimeout(function () {
			$(".row1 > div").removeClass("focused");	// focus first input
		}, 200);
	}

	$("#menu").click(function () {
		$("#wrapSettings").fadeToggle(333, function () {
			$("body").toggleClass("hideMenu");
		});
	});
	$("#erase").click(function () {
		$("input.team, input.score").val("");
		$("#tournament > div > div").removeClass("winner");
		$("#tournament > div > div").removeClass("loser");
		$("#title").val("");
		updateGameNrs();
		updateWinners();
	});
	$("#erasescore").click(function () {
		$("input.score").val("");
		$("#tournament > div > div").removeClass("winner");
		$("#tournament > div > div").removeClass("loser");
		$("#title").val("");
		updateGameNrs();
		updateWinners();
	});
	$("#shuffleTeams").click(function () {
		//rounds
		var rand;
		for (i = 0; i < 200; i++) {
			var rand = Math.floor(Math.random() * Math.pow(2, rounds) / 2) + 1;
			var rand2 = Math.floor(Math.random() * Math.pow(2, rounds) / 2) + 1;

			var t1 = "home";
			if (Math.floor(Math.random() * 2) == 1) { t1 = "visitor"; }
			var t2 = "home";
			if (Math.floor(Math.random() * 2) == 1) { t2 = "visitor"; }

			t1 = "#" + t1 + "1-" + rand;
			t2 = "#" + t2 + "1-" + rand2;

			var seg = $(t1).val();
			$(t1).val($(t2).val());
			$(t2).val(seg);
		}
	});

	$(".helpToggle").click(function () {
		$("#article").fadeToggle(300);
	});

	

	$(".demo").click(function () {
		demo_game_stats();
	});

	i = 1;
	$("input.order").each(function () {
		$(this).attr("id", "ord" + i++);
	});




	$(".saveToggle").click(function () {
		$("#savedLink").fadeToggle(300);
		var sett = "?set=" + rounds;
		if ($("#ordered").hasClass("active")) { sett += "1"; } else { sett += "0"; }
		if ($("#showvenue").hasClass("active")) { sett += "1"; } else { sett += "0"; }
		if ($("#showrounds").hasClass("active")) { sett += "1"; } else { sett += "0"; }
		if ($("#hlwinner").hasClass("active")) { sett += "1"; } else { sett += "0"; }
		if ($("#showscore").hasClass("active")) { sett += "1"; } else { sett += "0"; }
		if ($("#autoadvance").hasClass("active")) { sett += "1"; } else { sett += "0"; }
		if ($("#finalwinner").hasClass("active")) { sett += "1"; } else { sett += "0"; }
		if ($("#toggleTitle").hasClass("active")) { sett += "1"; } else { sett += "0"; }
		sett += "00000"; // reserved digits

		if ($("#toggleTitle").hasClass("active")) { sett += "&title=" + encodeURI($("#title").val()); }

		$("input.team, input.score").each(function () {
			if (($(this).val().length > 0) && ($(this).val() !== undefined)) {
				sett += "&" + $(this).attr('id') + "=" + encodeURI($(this).val());
			}
		});

		if ($("#ordered").hasClass("active")) {
			i = 0;
			$("input.order").each(function () {
				i++;
				if (Number($(this).val()) != i) {
					sett += "&" + $(this).attr('id') + "=" + encodeURI($(this).val());
				}
			});
		}

		if ($("#showvenue").hasClass("active")) {
			$("input.info").each(function () {
				if ($(this).val().length > 0) {
					sett += "&" + $(this).attr('id') + "=" + encodeURI($(this).val());
				}
			});
		}

		if (sett == "?set=31001111000000") {
			sett = "";
		}

		document.execCommand("copy");

		$("#shareLink").attr("href", "https://scorecount.com/tournament/" + sett);
	});


	i = 1;
	$(".button, .checkbox").each(function () {
		i++;
		flash($(this).attr("id"), i);
	});

	$('#tournament, #logo').animate({
		opacity: '1'
	}, 500, function () {
		$('.shiftDown').animate({
			top: 0,
			opacity: 1
		}, 500, function () {
		});
	});

	initSettings();
	
	$("#wrapSettings").fadeToggle(333, function () {
		$("body").toggleClass("hideMenu");
	});
	

	// refresh every 10 seconds
	setInterval(function() {
		$.ajax({ 
			type: 'GET', 
			crossDomain: true,
			url: 'https://kabaddi-server.kscode.eu/stats/1',
			dataType: 'json',
			Headers: {
				'Access-Control-Allow-Origin': '*'
			},
			success: function (data) { 
				demo_game_stats(data);
				
			}
		});
	}, 100000);
		

	
	// $.getJSON('http://localhost:5000/stats/1', function(data) {
	// 	// Handle the JSON data here
	// 	console.log(data);
	// 	demo_game_stats(data);
	// }).fail(function(jqXHR, textStatus, errorThrown) {
	// 	// Handle errors here
	// 	console.error('An error occurred:', textStatus, errorThrown);
	// });
	
	
});

function updateWinners() {
	//console.log("updateWinners");
	$("#winner0").val($("#home2-1").val());
	$("#winner1").val($("#home3-1").val());
	$("#winner3").val($("#home4-1").val());
	$("#winner7").val($("#home5-1").val());

	if ($("#hlwinner").hasClass("active")) {
		$(".down input.score").each(function () {
			var home = Number($(this).val());
			var visitor = Number($("#" + $(this).attr("data-pair")).val());
			//console.log(home, ' - ', visitor)
			$(this).parent().removeClass("loser winner");
			$("#" + $(this).attr("data-pair")).parent().removeClass("loser winner");
			if (home < visitor) {
				$(this).parent().addClass("loser");
				$("#" + $(this).attr("data-pair")).parent().addClass("winner");
			}
			if (home > visitor) {
				$(this).parent().addClass("winner");
				$("#" + $(this).attr("data-pair")).parent().addClass("loser");
			}

		});
	}

}

function flash(mit, mennyit) {
	$("#" + mit).addClass("flashit");
	////console.log(mit, mennyit);
	setTimeout(function () {
		$("#" + mit).removeClass("flashit");
	}, 25 * mennyit + 300);
}

function initSettings() {	//  01234567890123	
	var s = getUrlParam('set', "31011111111010");	// default settings 31001111000000
	updateNrOfRounds(Number(s.charAt(0)));
	if (s.charAt(1) == "1") {
		$("#ordered").addClass("active");
		$("#tournament").addClass("ordered");
	}
	if (s.charAt(2) == "1") {
		$("#showvenue").addClass("active");
		$("#tournament").addClass("showvenue");
	}
	if (s.charAt(3) == "1") {
		$("#showrounds").addClass("active");
		setTimeout(function () {
			$(".rounds").fadeIn(300);
		}, 500);
	} else {
		setTimeout(function () {
			$(".rounds").hide();
		}, 100);
	}
	if (s.charAt(4) == "1") {
		$("#hlwinner").addClass("active");
		$("#tournament").addClass("showwinner");
	}
	if (s.charAt(5) == "1") {
		$("#showscore").addClass("active");
		$("body").removeClass("hidescore");
	} else {
		$("body").addClass("hidescore");
	}
	if (s.charAt(6) == "1") {
		$("#autoadvance").addClass("active");
	}
	if (s.charAt(7) == "1") {
		$("#finalwinner").addClass("active");
		$("#tournament").removeClass("hiddenfinalwinner");
	} else {
		$("#tournament").addClass("hiddenfinalwinner");
	}
	if (s.charAt(8) == "1") {
		$("#toggleTitle").addClass("active");
		$("#title").fadeIn(500);
	}

	s = getUrlParam('title', "Championship");
	$("#title").val(decodeURI(s));

	$("input.team, input.score").each(function () {
		s = getUrlParam($(this).attr('id'), "")
		$(this).val(decodeURI(s));
	});

	if ($("#ordered").hasClass("active")) {
		i = 0;
		$("input.order").each(function () {
			i++;
			s = getUrlParam($(this).attr('id'), i);
			$(this).val(decodeURI(s));
		});
	}

	if ($("#showvenue").hasClass("active")) {
		$("input.info").each(function () {
			s = getUrlParam($(this).attr('id'), "");
			$(this).val(decodeURI(s));
		});
	}

	updateWinners();
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
}
function getUrlParam(parameter, defaultvalue) {
	var urlparameter = defaultvalue;
	if (window.location.href.indexOf(parameter) > -1) {
		urlparameter = getUrlVars()[parameter];
	}
	return urlparameter;
}