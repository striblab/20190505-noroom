import * as d3 from 'd3';
import * as c3 from 'c3';

class Chart {

    constructor(target) {
        this.target = target;
        this.chartCounts = null;
    }

    render() {
        var self = this;

        var padding = {
            top: 20,
            right: 40,
            bottom: 20,
            left: 60,
        };

        self.chartCounts = c3.generate({
            bindto: self.target,
            padding: padding,
            data: {
                columns: [
                    ['Population', 10463,9882,9387,9298],
                    ['Foreign', 171,171,324,461]
                ],
                type: 'bar',
                groups: [
                    ['Foreign','Population']
                ],
                order: 'asc',
                line: {
                    connectNull: true
                }
            },
            legend: {
                show: false
            },
            line: {
                connectNull: true
            },
            color: {
                pattern: ['#e0e0e0','#3580A3']
            },
            axis: {
                // rotated: true,
                y: {
                    max: 12000,
                    min: 0, 
                    padding: {
                        bottom: 0,
                        top: 0
                    },
                    tick: {
                        count: 4,
                        values: [0, 4000, 8000, 12000],
                        format: d3.format(',')
                    }
                },
                x: {
                    padding: {
                        right: 0,
                        left: 0
                    },
                    type: 'category',
                    categories: ['1990','2000','2010','2017'],
                    tick: {
                        // rotate: -75,
                        multiline: false,
                        // values: [1950, 1958, 1966, 1974, 1982, 1990, 1998, 2006, 2014, 2018, 2022]
                    },
                    // height: 40
                }
            },
            grid: {
                focus: {
                    show: false
                },
                y: {
                    lines: [{
                        value: 0.5,
                        text: '',
                        position: 'start',
                        class: 'powerline'
                    }]

                }
            }
            // tooltip: {
            //     contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
            //         return '<div class="chart-tooltip gray3">' + d[0].x + '</div><div class="chart-tooltip blue4"><span class="tooltip-label">Blacks 16-24:</span>' +
            //             '<span class="tooltip-value">' + defaultValueFormat(d[0].value) + '</span></div><div class="chart-tooltip blue2"><span class="tooltip-label">Blacks 25-34:</span>' +
            //             '<span class="tooltip-value">' + defaultValueFormat(d[1].value) + '</span></div>'
            //     }
            // }
        });

    }
}

export {
    Chart as
    default
}