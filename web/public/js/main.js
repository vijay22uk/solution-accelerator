
$(document).ready(function () {
    var tokenRaw = localStorage.getItem("token");
    var token = tokenRaw && parseJwt(tokenRaw);
    if (token && (new Date().getTime() / 1000) <= token.exp) {
        initApp();
        setDetails(token);

    } else {
        $('#login-modal').modal({ backdrop: 'static', keyboard: false });
        $('#login-modal').modal('show', { backdrop: 'static', keyboard: false });
    }
    $("#loginForm").submit(submitform);
})
function setDetails(token) {
    $("#username").text(token.name);
}

function submitform(ev) {
    var formData = {
        "name": $('input[name=user]').val(),
        "password": $('input[name=password]').val()
    };

    $.ajax({
        type: 'POST',
        url: "/authenticate/",
        data: formData, // what type of data do we expect back from the server
        encode: true,
        success: function (data) {
            if (data.success) {
                localStorage.setItem("token", data.token);
                var token = parseJwt(data.token);
                $('#login-modal').modal('hide');
                initApp();

                setDetails(token);
            }
            else {
                toastr.error(data.message);
            }
        }
    })
    ev.preventDefault();
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

function initApp() {

    var ajaxCall2, ajaxCall = null;
    var appData = {};
    $('[data-toggle="tooltip"]').tooltip()
    $('.fab').hover(function () {
        $(this).toggleClass('active');
    });
    //$('#addmodal').modal('show');
    // event binding
    $('#sitename').keyup(function (e) {
        $('.compList-container').hide();
        if (e.keyCode == 13) {
            checksitename();
        }
    });
    $(document).on("click", "#addcompany", function () {
        reset();
        $('#addmodal').modal('show');
    })
    $(document).on("click", "#checksitename", function () {
        $('.compList-container').hide();
        checksitename();
    });
    $(document).on("click", "#track", function () {
        if (appData._id) {
            //update //TODO
            var data = { name: $('#sitename').val(), trackList: [] };
            $("#compList li").each(function () {
                var current = $(this);
                var compData = { name: current.find(".the-url").text(), selected: current.find('input').get(0).checked, scope: current.find(".big.percircle").data("percent") };
                data.trackList.push(compData);
            });
        } else {
            //save
            var sitename = $('#sitename').val();
            if (sitename == "") {
                toastr.error("Please enter a valid url");
                return
            }
            var data = { name: sitename, trackList: [] };
            $("#compList li").each(function () {
                var current = $(this);
                var compData = { name: current.find(".the-url").text(), selected: current.find('input').get(0).checked, score: current.find(".big.percircle").data("percent") };
                data.trackList.push(compData);
            });
        }

        ajaxHelper("/api/competitor", "POST", data, function () {
            toastr.success("Saved");
            loadAllCompany();
            $('#addmodal').modal('hide');
        }, function () {
            toastr.error("Something went wrong");
        })
    })
    $(document).on("click", "span.the-url", function () {
        loadTweets($(this).text().trim());
    });
    $(document).on("click", ".my-company", function () {
        reset();
        var id = $(this).data("id");
        $(".loader").show();
        ajaxHelper("/api/companydetails/" + id, "GET", null, function (data) {
            $('#sitename').val(data.name);
            $('#compList').empty();
            for (var i = 0; i < data.trackList.length; i++) {
                var _li = $('<li class ="list-group-item"><span class="the-url" title="Load Tweets">' + data.trackList[i].name + '</span></li>');
                var _switch = $('<label class="switch"><input type="checkbox" ><div class="slider round"></div></label>');
                if (data.trackList[i].selected=="true") {
                    _switch.find('input').attr('checked', 'checked');
                }
                var _circle = $('<div title="Score" data-percent="' + (data.trackList[i].score) + '"class="big"></div>');
                _li.append(_switch);
                _li.append(_circle);
                _circle.percircle();
                $('#compList').append(_li);
            }
            $(".loader").hide();
            $('.compList-container').show();
            $('#addmodal').modal('show');
        }, function () {
            toastr.error("Unable to load", "Error")
        })
    })
    function loadTweets(txt) {
        var _index = txt.indexOf('.');
        if (_index > 0) {
            txt = txt.substring(0, _index);
        }
        $('.tweet-container').empty();
        console.log(txt);
        $('#selectedUrl').text(txt);
        $('#tweetmodal').modal('show');
        if (ajaxCall2 && ajaxCall2 != null)
            ajaxCall2.abort();
        $(".tweet-loaer").show();
        var url = "/api/search?siteName=" + txt;
        ajaxCall2 = $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result) {
                    $('.tweet-container').show();
                    fillTweets(result);
                }
                else {
                    toastr.error("X0232cce");
                }

            },
            error: function (error) {
                if (error.statusText !== 'abort') {
                    toastr.error("$%%$^&&***)*%$##", 'Something Went Wrong');
                }
                // $('.example').html('No Data : Error')

            }
        }).always(function () {
            $(".tweet-loaer").hide();
        })
    }
    function checksitename() {
        var sitename = $('#sitename').val();
        if (sitename == "") {
            toastr.error("Please enter a valid url");
            return
        }
        if (ajaxCall && ajaxCall != null)
            ajaxCall.abort();
        $(".loader").show();
        var url = "/api/competitor?siteName=" + sitename;
        ajaxCall = $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result) {
                    $('.compList-container').show();
                    FillComp(result.SimilarSites, sitename);
                }
                else {
                    toastr.error("Unable to find suggetions !!");
                }

            },
            error: function (error) {
                if (error.statusText !== 'abort') {
                    toastr.error("Please enter a valid domain or try again.", 'Something Went Wrong');
                }
                // $('.example').html('No Data : Error')

            }
        }).always(function () {
            $(".loader").hide();
        })
    }

    function FillComp(compdata, sitename) {
        $('#compList').empty();
        for (var i = 0; i < compdata.length; i++) {
            var _li = $('<li class ="list-group-item"><span class="the-url" title="Load Tweets">' + compdata[i].Url + '</span></li>');
            var _switch = $('<label class="switch"><input type="checkbox" ><div class="slider round"></div></label>');
            //if (i % 2 === 0) {
                _switch.find('input').attr('checked', 'checked');
            //}
            var _circle = $('<div title="Score" data-percent="' + (compdata[i].Score * 100).toFixed() + '"class="big"></div>');
            _li.append(_switch);
            _li.append(_circle);
            _circle.percircle();
            $('#compList').append(_li);
        }
    }

    function fillTweets(tweets) {
        var tt = $('.tweet-container').empty();
        for (var t = 0; t < tweets.length; t++) {
            var tweetcard = $('<div class="container-fluid"><div class="col-md-2"><img src="' + tweets[t].user.profile_image_url + '" /></div>' +
                '<div class="col-md-8">' + tweets[t].text + '</div>' +
                '<div class="col-md-2"><img class="score-img" src="/img/happy.png" /></div>' +
                '</div>')
            if (tweets[t].score <= 0) {
                tweetcard.find('.score-img').attr('src', '/img/sae.png')
            }
            tt.append(tweetcard);
        }

    }
    function ajaxHelper(url, type, data, successcallback, errorcallback) {
        $.ajax({
            type: type,
            url: url,
            data: data, // what type of data do we expect back from the server
            success: successcallback,
            error: errorcallback
        })
    }
    function loadAllCompany() {
        var cc = $("#companies").empty();
        ajaxHelper("/api/company", "GET", null, function (data) {
            for (var i = 0; i < data.length; i++) {
                var tracklist = [];
                for (var j = 0; j < data[i].trackList.length; j++) {
                    if (data[i].trackList[j].selected == "true") {
                        tracklist.push(data[i].trackList[j].name);
                    } else {
                        tracklist.push("<del>" + data[i].trackList[j].name + "</del>");
                    }
                }
                var card = '<div data-id="' + data[i]._id + '" class="col-md-4"><div class="panel panel-primary"><div class="panel-heading my-company" data-id="' + data[i]._id + '">' + data[i].name + '</div><div class="panel-body" ><p>' + tracklist.join(" , ") + '</p></div>'
                cc.append($(card));
            }

        }, function () {
            toastr.error("something went wrong")
        })
    }
    function reset() {
        $('#sitename').val("");
        $('.compList-container').hide();
    }
    loadAllCompany();
}