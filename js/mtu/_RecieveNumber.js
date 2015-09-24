var _reciever_number = {
    PRODUCTTYPE: {
        IMTU: "I",
        DMTU: "D"
    },

    RECIEVERCONTROLLERS: {
        PRODUCTTYPE: $("#ReceiverNumber").attr("ProductType"),
        RECIEVERNO: $("#ReceiverNumber"),
        COUNTRY: $("#Country"),
        COUNTRYDESC: $("#country_desc"),
        COUNTRYFLAG: $("#country_flag")
    },

    init: function(form) {
        form = form || $("#_receiverForm");

        if (form.length > 0) {
            this.RECIEVERCONTROLLERS.PRODUCTTYPE = form.find("#ReceiverNumber").attr("ProductType");
            this.RECIEVERCONTROLLERS.RECIEVERNO = form.find("#ReceiverNumber");
            this.RECIEVERCONTROLLERS.COUNTRY = form.find("#Country");
            this.RECIEVERCONTROLLERS.COUNTRYDESC = form.find("#country_desc");
            this.RECIEVERCONTROLLERS.COUNTRYFLAG = form.find("#country_flag");
        }

        (this.RECIEVERCONTROLLERS.PRODUCTTYPE == this.PRODUCTTYPE.IMTU ? this.IMTU() : this.DMTU());
    },

    DMTU: function (form) {
        form = form || $("#_receiverForm");
        var srvsel_dest = this.RECIEVERCONTROLLERS.RECIEVERNO;
        form.find(":submit").attr("disabled", (srvsel_dest.val().length < i18n.min_pinless_length && srvsel_dest.val().length < i18n.max_pinless_length));
        srvsel_dest.on("keyup onpaste", function () {
            form.find(":submit").attr("disabled", (srvsel_dest.val().length < i18n.min_pinless_length && srvsel_dest.val().length < i18n.max_pinless_length));
        });
    },

    IMTU: function (form) {
        form = form || $("#_receiverForm");
        var srvsel_dest = this.RECIEVERCONTROLLERS.RECIEVERNO;
        var srvsel_country = this.RECIEVERCONTROLLERS.COUNTRYDESC;
        var srvsel_country_flag = this.RECIEVERCONTROLLERS.COUNTRYFLAG;
        var hidden_country = this.RECIEVERCONTROLLERS.COUNTRY;
        var data = getData();
        var closing = false;

        form.find(":submit").attr("disabled", true);

        function getData() {
            var _data = {};
            $.ajax({
                url: '/international-mobile-topup/auto-complete-data',
                type: 'POST',
                dataType: 'json',
                async: false,
                contentType: 'application/json; charset=utf-8',
                success: function (result) { _data = result; }
            });
            return _data
        }

        function select_item(label, value) {
            srvsel_dest.val(label);
        }

        function display_item(value) {
            if (value == null) {
                value = {
                    country_name: "",
                    country_code: "",
                    phoneValidator: ""
                };
            }

            srvsel_country.text("");
            srvsel_country_flag.removeClass(function (index, cls) {
                return (cls.match(/(^|\s)flag-\S+/g) || []).join(' ');
            });
            // The filter will remove the empty values in the array
            if (($.trim(value.npa).split(",").filter(function (e) { return e }).length == 0) || /*$.trim(value.npa).split(",").filter(function (e) { return e }).length > 0 && */ $(".ui-autocomplete-input").val().length <= $.trim(value.label).length) {
                srvsel_country.text(value.country_name);
                if (value.country_code.length == 0) {
                    srvsel_country_flag.removeClass(function (index, cls) {
                        return (cls.match(/(^|\s)flag-\S+/g) || []).join(' ');
                    });
                } else {
                    srvsel_country_flag.addClass($type.format("flag flag-{0}", value.country_code.toLowerCase()));
                }
                hidden_country.val(value.country_code);
            }

            var validPhone = true;
            if ((value.phoneValidator || "").length > 0) {
                validPhone = RegExp(value.phoneValidator).test(srvsel_dest.val());
                // Part-1 - Get the max allowed digits from the regexp({9,10}); Part-2 - Get the label length
                var maxLength = (parseInt(/{([^}]+)}/g.exec(value.phoneValidator)[1].split(",").pop()) + parseInt(value.label.length));
                srvsel_dest.attr("maxlength", maxLength);
            }
            form.find(":submit").attr("disabled", value.country_name.length == 0 || !form.valid() || !validPhone);
        }

        function FindNPA(data, value, item) {
            var _done = false;
            if (item.label.length >= value.length)
                return _done;

            var npa = data.split(",");
            for (var i in npa) {
                if (value == npa[i].substr(0, value.length)) {
                    _done = (moreOptions(npa, value).length == 1);
                    return _done;
                }
            }
          return _done
        }

        function NPAsByCountry(label, value) {
            if (label.length == 0) return false;
            var _npaList = $.grep(data, function (element, index) {
                return (element.npa.length > 0 && element.country_code == label)
            });

            var _done = false;
            $(_npaList).each(function (index, element) {
                var npa = element.npa.split(",");
                for (var i in npa) {
                    if (value == npa[i].substr(0, value.length)) {
                        _done = true;
                        break;
                    }
                }
            });
          return _done;
        }

        function moreOptions(data, value) {
            return $.grep(data, function (element, index) {
                return ((value == element.substr(0, value.length)));
            });
        }

        srvsel_dest.autocomplete({
            source: function (request, response) {
                var sValue = request.term
                var aSearch = [];
                $(data).each(function (iIndex, sElement) {
                    if (sElement.label.substr(0, sValue.length) == sValue || NPAsByCountry(sElement.country_code, sValue)) {
                        aSearch.push(sElement);
                    }
                });
                response(aSearch);
            },
            minLength: 1,
            autoSelect: true,
            select: function (event, ui) {
                event.preventDefault();
                display_item(ui.item);
                select_item(ui.item.label, ui.item.value);
            },
            open: function () {
                closing = true;
            },
            close: function () {
                closing = false;
            }

        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            var _disableOption = (item.npa.split(",").filter(function (e) { return e }).length > 0 && !FindNPA(item.npa, $(".ui-autocomplete-input").val(), item) ? "'ui-state-disabled'" : '');
            var _item = '<a><div><div style="">' + item.country_name + '<div style="float: right;">' + item.value + '<span style="margin-left: 2px" class="flag flag-' + item.country_code.toLowerCase() + '"></span></div></div></div></a>';
            return $("<li class=" + _disableOption + "></li>").data("item.autocomplete", item).append(_item).appendTo(ul);
        };

        $(".ui-autocomplete-input").bind("keypress keyup", function (event) {
            var item = $(event.target).val();
            var returnedData = $.grep(data, function (element, index) {
                var eleLength = element.label.length;
                return (item.substr(0, element.label.length) == element.label.substr(0, Math.min(element.label.length, item.length)) && element.npa.length == 0);
            });

            $($.grep(data, function (element, index) {
                return (element.npa.length > 0)
            })).each(function (index, element) {
                var npa = element.npa.split(",");
                for (var i in npa) {
                    if (item.substr(0, npa[i].length) == npa[i].substr(0, item.length)) {
                        if ($(returnedData).filter(function () { return this.country_code == element.country_code; }).length == 0)
                            returnedData.push({ label: element.label, value: element.label, country_name: element.country_name, country_code: element.country_code, phoneValidator: element.phoneValidator });
                    }
                }
            });
           display_item(((returnedData.length != 1) ? null : returnedData.pop()));
        });

        $(".ui-autocomplete-input").bind("focus", function (event) {
            if ((!closing) && ($(this).val() !== "")) {
                $(this).autocomplete("search");
            }
        });

        $(".ui-autocomplete-input").bind("focusout", function (event) {
            var autocomplete = $(this).data("ui-autocomplete");
            if (!autocomplete.options.autoSelect || autocomplete.selectedItem) { return; }

            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
            autocomplete.widget().children(".ui-menu-item").each(function () {
                var item = $(this).data("ui-autocomplete-item");
                if (matcher.test(item.label || item.value || item) && item.npa.length == 0) {
                    autocomplete.selectedItem = item;
                    return false;
                }
            });

            if (autocomplete.selectedItem) {
                autocomplete._trigger("select", event, { item: autocomplete.selectedItem });
            }
        });
        if (srvsel_dest.val().length > 0)
            $(".ui-autocomplete-input").trigger("keyup");
    }
}

$(_reciever_number.init());

