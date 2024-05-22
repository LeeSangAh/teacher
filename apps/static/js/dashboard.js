var months_data;
var monthsnumber_data;
/* -------------------------------------------------------------------------- */

/*                            Theme Initialization                            */

/* -------------------------------------------------------------------------- */

months_data = ['2021', '2022', '2023'];
// monthsnumber_data = [[60, 80, 60, 80, 65, 130, 120, 100, 30, 40, 30, 70],
//     [100, 70, 80, 50, 120, 100, 130, 140, 90, 100, 40, 50],
//     [80, 50, 60, 40, 60, 120, 100, 130, 60, 80, 50, 60]];

// docReady(totalSalesInit('.echart-line-total-sales', '.select-month', months_data, monthsnumber_data));
// docReady(totalSalesInit('.echart-line-total-sales1', '.select-month1',months_data, monthsnumber_data));

docReady(detectorInit);
docReady(handleNavbarVerticalCollapsed);
docReady(totalOrderInit);
docReady(weeklySalesInit);
docReady(marketShareInit);
docReady(topProductsInit);
docReady(navbarTopDropShadow);
docReady(tooltipInit);
docReady(popoverInit);
docReady(toastInit);
docReady(progressAnimationToggle);
docReady(glightboxInit);
docReady(plyrInit);
docReady(initMap);
docReady(dropzoneInit);
docReady(choicesInit);
docReady(formValidationInit);
docReady(barChartInit);
// docReady(leafletActiveUserInit);
docReady(countupInit);
docReady(copyLink);
docReady(navbarDarkenOnScroll);
docReady(typedTextInit);
docReady(tinymceInit);
docReady(bulkSelectInit);
docReady(chatInit);
docReady(quantityInit);
docReady(navbarComboInit);
docReady(listInit);
docReady(swiperInit);
docReady(ratingInit);
docReady(draggableInit);
docReady(kanbanInit);
docReady(fullCalendarInit);
docReady(appCalendarInit);
docReady(managementCalendarInit);
docReady(lottieInit);
docReady(wizardInit);
docReady(searchInit);
docReady(cookieNoticeInit);
docReady(themeControl);
docReady(dropdownOnHover);
docReady(marketShareEcommerceInit);
docReady(productShareDoughnutInit);
docReady(totalSalesEcommerce);
docReady(avgEnrollmentRateInit);
docReady(bandwidthSavedInit);
docReady(salesByPosLocationInit);
docReady(returningCustomerRateInit);
docReady(candleChartInit);
docReady(grossRevenueChartInit);
docReady(scrollbarInit);
docReady(iconCopiedInit);
docReady(reportForThisWeekInit);
docReady(basicEchartsInit);
docReady(chartScatter);
docReady(chartDoughnut);
docReady(chartPie);
docReady(chartPolar);
docReady(chartRadar);
docReady(chartCombo);
docReady(dropdownMenuInit);
docReady(audienceChartInit);
docReady(sessionByBrowserChartInit);
docReady(sessionByCountryChartInit);
docReady(activeUsersChartReportInit);
docReady(trafficChannelChartInit);
docReady(bounceRateChartInit);
docReady(usersByTimeChartInit);
docReady(sessionByCountryMapInit);
docReady(mostLeadsInit);
docReady(closedVsGoalInit);
docReady(leadConversionInit);
docReady(dealStorageFunnelInit);
docReady(revenueChartInit);
docReady(locationBySessionInit);
docReady(realTimeUsersChartInit);
docReady(linePaymentChartInit);
docReady(chartBubble);
docReady(chartLine);
docReady(treeviewInit);
docReady(scrollInit);
docReady(echartsUnresolvedTicketsInit);
docReady(echartsNumberOfTicketsInit);
docReady(echartsCustomerSatisfactionInit);
docReady(echartsDistributionOfPerformanceInit);
docReady(echartsSatisfactionSurveyInit);
docReady(echartsReceivedTicketsInit);
docReady(topCustomersChartInit);
docReady(ticketVolumeChartInit);
docReady(echartTicketPriority);
docReady(userByLocationInit);
docReady(courseEnrollmentsInit);
docReady(weeklyGoalsInit);
docReady(assignmentScoresInit);
docReady(browsedCoursesInit);
docReady(courseStatusInit);
docReady(bottomBarInit);
docReady(marketingExpensesInit);
docReady(chartHalfDoughnutInit);
docReady(trendingKeywordsInit);
docReady(D3PackedBubbleInit);
docReady(dataTablesInit);
docReady(select2Init);
docReady(hideOnCollapseInit);
docReady(unresolvedTicketsTabInit);

//# sourceMappingURL=theme.js.map

function sin_total_student() {
    var postdata = {
        'months_data': months_data
    }
    $.ajax({
        type: 'POST',
        url: '/dash_board/dash_board_total_sin',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            // console.log(data.result2);
            monthsnumber_data = data.result2
            docReady(totalSalesInit('.echart-line-total-sales', '.select-month', months_data, monthsnumber_data));
        },
        beforeSend:function(){
            // (이미지 보여주기 처리)
            $('.wrap-loading2').removeClass('display-none');
        },complete:function(){
            // (이미지 감추기 처리)
            $('.wrap-loading2').addClass('display-none');
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function platon_total_student() {
    var postdata = {
        'months_data': months_data
    }
    $.ajax({
        type: 'POST',
        url: '/dash_board/dash_board_total_platon',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            // console.log(data.result2);
            monthsnumber_data = data.result2
            docReady(totalSalesInit('.echart-line-total-sales1', '.select-month1',months_data, monthsnumber_data));
        },
        beforeSend:function(){
            // (이미지 보여주기 처리)
            $('.wrap-loading3').removeClass('display-none');
        },complete:function(){
            // (이미지 감추기 처리)
            $('.wrap-loading3').addClass('display-none');
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};
