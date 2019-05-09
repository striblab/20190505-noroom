import 'intersection-observer';
import * as d3 from 'd3';
import * as d3tooltip from 'd3-tooltip';
import * as topojson from 'topojson';
import mncounties from '../sources/counties.json';
import population from '../sources/popchange.json';

class Map {

    constructor(target) {
        this.target = target;
        this.svg = d3.select(target + " svg").attr("width", $(target).outerWidth()).attr("height", $(target).outerHeight());
        this.g = this.svg.append("g");
        this.g2 = this.svg.append("g");
        this.zoomed = false;
        this.scaled = $(target).width() / 520;
        this.colorScale1 = d3.scaleLinear().domain([-0.5,0]).range(['#9C0004','#F2AC93']);
        this.colorScale2 = d3.scaleLinear().domain([0,1]).range(['#C7E5B5','#299E3D']);
        this.colorScale3 = d3.scaleLinear().domain([1,0.75,0.50,0]).range(['#0D4673', '#3580A3', '#A7E6E3', '#D1E6E1']);
        this.colorScale4 = d3.scaleLinear().domain([3, 2, 1, 0]).range(['#F2614C', '#F2614C', '#5BBF48', '#DDDDDD']);
    }

    /********** PRIVATE METHODS **********/

    // Detect if the viewport is mobile or desktop, can be tweaked if necessary for anything in between
    _detect_mobile() {
        var winsize = $(window).width();

        if (winsize < 520) {
            return true;
        } else {
            return false;
        }
    }

    /********** PUBLIC METHODS **********/

    // Render the map
    render() {
        var self = this;

        var projection = d3.geoAlbers().scale(5037).translate([50, 970]);

        var width = $(self.target).outerWidth();
        var height = $(self.target).outerHeight();
        var centered;

        var path = d3.geoPath(projection);

        var svg = d3.select(self.target + " svg").attr("width", width).attr("height", height);
        var g = svg.append("g");
        var g2 = svg.append("g");
        var tooltip = d3tooltip(d3);

        var dataMN = population.change;

        // self._render_legend();

        // Only fire resize events in the event of a width change because it prevents
        // an awful mobile Safari bug and developer rage blackouts.
        // https://stackoverflow.com/questions/9361968/javascript-resize-event-on-scroll-mobile
        var cachedWidth = window.innerWidth;
        d3.select(window).on("resize", function() {
            var newWidth = window.innerWidth;
            if (newWidth !== cachedWidth) {
                cachedWidth = newWidth;
            }
        });

        var tooltip = function(accessor) {
            return function(selection) {
                var tooltipDiv;
                var bodyNode = d3.select('body').node();
                selection.on("mouseover", function(d, i) {
                        // Clean up lost tooltips
                        d3.select('body').selectAll('div.tooltip').remove();
                        // Append tooltip
                        tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
                        tooltipDiv.style('left', (d3.event.pageX + 10) + 'px')
                            .style('top', (d3.event.pageY - 15) + 'px')
                            .style('position', 'absolute')
                            .style('z-index', 1001);
                        // Add text using the accessor function
                        var tooltipText = accessor(d, i) || '';

                        tooltipDiv.html(tooltipText);
                        $("#tip").html(tooltipText);

                        if (self._detect_mobile() == true) {
                            $("#tip").show();
                            // $(".key").hide();
                        }
                        // Crop text arbitrarily
                        //tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
                        //    .html(tooltipText);
                    })
                    .on('mousemove', function(d, i) {
                        // Move tooltip
                        tooltipDiv.style('left', (d3.event.pageX + 10) + 'px')
                            .style('top', (d3.event.pageY - 15) + 'px');

                    })
                    .on("mouseout", function(d, i) {
                        // Remove tooltip
                        tooltipDiv.remove();
                        $("#tip").hide();
                        // $(".key").show();
                        $("#tip").html("");
                    }).on("mouseleave", function() {
                        $(".shifter").removeClass("arrowselect");
                    });

            };
        };

        svg
        .append('defs')
        .append('pattern')
          .attr('id', 'texture1')
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('width', 8)
          .attr('height', 8)
        .append('path')
          .attr('d', 'M0 0L8 8ZM8 0L0 8Z')
          .attr('stroke', '#0D4673')
          .attr('stroke-width', 0.35);

        g.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(mncounties, mncounties.objects.counties).features)
            .enter().append("path")
            .attr("d", path)
            .attr("class", function(d) {
                return "county C" + d.properties.COUNTYFIPS;
            })
            .attr("id", function(d) {
                return "P" + d.properties.COUNTYFIPS;
            })
            .style("stroke-width", '1')
            .style("stroke", "#ffffff")
            .style("fill", function(d) {

                for (var i=0; i < dataMN.length; i++) {
                    if (dataMN[i].NAME == d.properties.COUNTYNAME) {
                        if (dataMN[i].Total90_17 > 0) {
                            return self.colorScale2(dataMN[i].Total90_17);
                        } else if (dataMN[i].Total90_17 < 0) {
                            return self.colorScale1(dataMN[i].Total90_17);
                        } else {
                            return "#DDDDDD"
                        }
                        // return self.colorScale4(dataMN[i].tier);
                    }
                }

                return "#dddddd";
            })
            .call(tooltip(function(d, i) {
                var votes;
                var diff;
                var color = "#ffffff";
                var nilf = 0;

                for (var i = 0; i < dataMN.length; i++) {
                    if (dataMN[i].NAME == d.properties.COUNTYNAME) {
                        var points = dataMN[i].tier;
                        var pct = dataMN[i].Total90_17;
                        var foreign = dataMN[i].foreignborn_90_17;
                        var color_scale = d3.scaleLinear().domain([4, 3, 2, 1, 0]).range(['#67B4C2', '#F2614C', '#F2614C', '#5BBF48', '#DDDDDD']);
                        return "<div class='countyName'>" + d.properties.COUNTYNAME + "</div><div class='number'><span class='legendary' style='background-color:" + color_scale(points) + ";'>" + d3.format("+.0%")(pct) + "</span> overall change</div><div class='number'><span class='legendary' style='background-color:" + color_scale(4) + ";'>" + d3.format("+.0%")(foreign) + "</span> foreign-born change</div>"
                    }
                }
              }));

              g.append("g")
              .attr("class", "counties")
              .selectAll("path")
              .data(topojson.feature(mncounties, mncounties.objects.counties).features)
              .enter().append("path")
              .attr("d", path)
              .attr("class", function(d) {
                  return "county C" + d.properties.COUNTYFIPS;
              })
              .attr("id", function(d) {
                  return "P" + d.properties.COUNTYFIPS;
              })
              .style("stroke-width", '1')
              .style("stroke", "#ffffff")
              .style("fill", function(d) {
                  for (var i=0; i < dataMN.length; i++) {
                      if (dataMN[i].NAME == d.properties.COUNTYNAME) {
                        if (dataMN[i].foreignborn_90_17 > 0 && dataMN[i].tier == 3) { return 'url(#texture1)'; }
                        else { return 'none'; }
                      }
                  }
              })
              .call(tooltip(function(d, i) {
                  var votes;
                  var diff;
                  var color = "#ffffff";
                  var nilf = 0;
  
                  for (var i = 0; i < dataMN.length; i++) {
                      if (dataMN[i].NAME == d.properties.COUNTYNAME) {
                          var points = dataMN[i].tier;
                          var pct = dataMN[i].Total90_17;
                          var foreign = dataMN[i].foreignborn_90_17;
                          var color_scale = d3.scaleLinear().domain([4, 3, 2, 1, 0]).range(['#67B4C2', '#F2614C', '#F2614C', '#5BBF48', '#DDDDDD']);
                          return "<div class='countyName'>" + d.properties.COUNTYNAME + "</div><div class='number'><span class='legendary' style='background-color:" + color_scale(points) + ";'>" + d3.format("+.0%")(pct) + "</span> overall change</div><div class='number'><span class='legendary' style='background-color:" + color_scale(4) + ";'>" + d3.format("+.0%")(foreign) + "</span> foreign-born change</div>"
                      }
                  }
                }));




     //City labels
        var marks = [{
          long: -92.100485,
          lat: 46.786672,
          name: "Duluth"
      },
      {
          long: -93.265015,
          lat: 44.977753,
          name: "Minneapolis"
      },
      {
          long: -93.999400,
          lat: 44.163578,
          name: "Mankato"
      },
      {
          long: -92.480199,
          lat: 44.012122,
          name: "Rochester"
      },
      {
          long: -94.202008,
          lat: 46.352673,
          name: "Brainerd"
      },
      {
          long: -96.753867,
          lat: 46.873908,
          name: "Moorhead"
      }
  ];


  g.append('g').attr('class', 'labels').selectAll("text")
          .data(marks)
          .enter()
          .append("text")
          .attr('class', function(d) {
              return 'city-label ' + d.name;
          })
          .attr("transform", function(d) {
            return "translate(" + projection([d.long, d.lat - 0.10]) + ")";
          })
          // .style("opacity",0)
          .text(function(d) {
              return " " + d.name;
     });

        var aspect = 500 / 550,
            chart = $(self.target + " svg");
        var targetWidth = chart.parent().width();
        chart.attr("width", targetWidth);
        chart.attr("height", targetWidth / aspect);
        if ($(window).width() <= 520) {
            $(self.target + " svg").attr("viewBox", "0 0 500 550");
        }

        $(window).on("resize", function() {
            targetWidth = chart.parent().width();
            chart.attr("width", targetWidth);
            chart.attr("height", targetWidth / aspect);
        });
    }
}

export {
    Map as
    default
}