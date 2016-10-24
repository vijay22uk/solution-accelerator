
$(document).ready(function () {
    var ajaxCall2, ajaxCall = null;

    $('#addmodal').modal('show');
    // event binding
    $('#sitename').keyup(function (e) {
        $('.compList-container').hide();
        if (e.keyCode == 13) {
            checksitename();
        }
    });
    $(document).on("click", "#checksitename", function () {
        $('.compList-container').hide();
        checksitename();
    });

    $(document).on("click", "span.the-url", function () {
        loadTweets($(this).text().trim());
    });
    function loadTweets(txt) {
        var _index = txt.indexOf('.');
        if(_index>0){
           txt = txt.substring(0,_index);
        }
        $('.tweet-container').empty();
        console.log(txt);
        $('#selectedUrl').text(txt);
        $('#tweetmodal').modal('show');
        if (ajaxCall2 && ajaxCall2 != null)
            ajaxCall2.abort();
        $(".tweet-loaer").show();
        var url = "/api/search?siteName=" + sitename;
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
            if (i % 2 === 0) {
                _switch.find('input').attr('checked', 'checked');
            }
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
                if(tweets[t].score<=0){
                    tweetcard.find('.score-img').attr('src','/img/sae.png')
                }
                tt.append(tweetcard);
        }

    }
});