
$(document).ready(function () {
    var ajaxCall = null;
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
    })


    function checksitename() {
        var sitename = $('#sitename').val();
        if (sitename == "") {
            toastr.error("Please enter a domain name");
            return
        }
        if (ajaxCall && ajaxCall != null)
            ajaxCall.abort();

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

                }

            },
            error: function (error) {
                if (error.statusText !== 'abort') {
                    toastr.error('Something Went Wrong');
                }
                // $('.example').html('No Data : Error')

            }
        })
    }

    function FillComp(compdata, sitename) {
        $('#compList').empty();
        for (var i = 0; i < compdata.length; i++) {
            var _li = $('<li class ="list-group-item ">' + compdata[i].Url + '</li>');
            var _circle = $('<div data-percent="'+(compdata[i].Score*100).toFixed() +'"class="big"></div>');
            _li.append(_circle);
            _circle.percircle();
            $('#compList').append(_li);
        }
    }
});