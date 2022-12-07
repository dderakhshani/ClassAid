import { Injectable } from '@angular/core';
import { StatsSerie } from '../models/stats-serie';

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    constructor() { }


    createDoubleSeriesChart(dataSerie1: StatsSerie[], dataSerie2: StatsSerie[], serie1: any, serie2: any) {
        let xAxisData: string[] = [];
        let data1 = [];
        let data2 = [];

        //Assumed that dataSerie1.length>=dataSerie2.length
        for (let i = 0, j = 0; i < dataSerie1.length;) {
            if (j < dataSerie2.length && (i >= dataSerie1.length || dataSerie1[i].name > dataSerie2[j].name)) {
                xAxisData.push(dataSerie2[j].name);
                j++;
            }
            else if (i < dataSerie1.length && (j >= dataSerie2.length || dataSerie1[i].name < dataSerie2[j].name)) {

                xAxisData.push(dataSerie1[i].name);
                i++;
            }
            else {
                xAxisData.push(dataSerie1[i].name);
                i++;
                j++;
            }
        }

        for (let i = 0; i < xAxisData.length; i++) {

            let found = dataSerie1.find((element: any) => xAxisData[i] == element.name);
            if (found)
                data1.push(found.value);
            else
                data1.push(0);

            found = dataSerie2.find((element: any) => xAxisData[i] == element.name);
            if (found)
                data2.push(found.value);
            else
                data2.push(0);
        }

        return {
            legend: {
                data: [serie1.name, serie2.name],
                align: 'left',
            },
            title: {
                show: dataSerie1.length === 0 && dataSerie2.length === 0,
                textStyle: {
                    color: "grey",
                    fontSize: 20
                },
                text: "No data to display",
                left: "center",
                top: "center"
            },
            grid: {
                bottom: 10,
                top: 35,
                containLabel: true
            },
            tooltip: {},
            xAxis: {
                data: xAxisData,
                silent: false,
                splitLine: {
                    show: false,
                },
            },
            yAxis: {},
            series: [
                {
                    name: serie1.name,
                    type: serie1.type,
                    data: data1,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: serie2.name,
                    type: serie2.type,
                    data: data2,
                    animationDelay: (idx: number) => idx * 10 + 100,
                },
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: (idx: number) => idx * 5,
        };
    }

    createSingleSerieChart(dataSerie: StatsSerie[], serie: any) {
        const xAxisData = [];

        for (let i = 0; i < dataSerie.length; i++) {
            xAxisData.push(dataSerie[i].name);
        }

        return {
            legend: {
                data: [serie.name],
                align: 'left',
            },
            title: {
                show: dataSerie.length === 0,
                textStyle: {
                    color: "grey",
                    fontSize: 20
                },
                text: "No data to display",
                left: "center",
                top: "center"
            },
            tooltip: {},
            xAxis: {
                data: xAxisData,
                silent: false,
                splitLine: {
                    show: false,
                },
            },
            yAxis: {},
            series: [
                {
                    name: serie.name,
                    type: serie.type,
                    data: dataSerie,
                    animationDelay: (idx: number) => idx * 10,
                }
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: (idx: number) => idx * 5,
        };
    }

    createPieChart(dataSerie: StatsSerie[], serie: any) {


        return {
            legend: {
                data: [serie.name],
                align: 'left',
            },
            title: {
                show: dataSerie.length === 0,
                textStyle: {
                    color: "grey",
                    fontSize: 20
                },
                text: "No data to display",
                left: "center",
                top: "center"
            },
            tooltip: {},
            series: [
                {
                    name: serie.name,
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '50%'],
                    data: dataSerie,
                    animationDelay: (idx: number) => idx * 10,
                    label: {
                        show: true,
                        position: 'outer',
                        alignTo: 'none',
                        bleedMargin: 5,
                        color: '#000',
                        formatter: '{b}:{d}%'
                    }
                }
            ]
        };
    }

    doubleSeriesStackChartMerged(dataSerie1: StatsSerie[], dataSerie2: StatsSerie[], serie1: any, serie2: any) {
        let yAxisData: string[] = [];
        let data1 = [];
        let data2 = [];

        //Assumed that dataSerie1.length>=dataSerie2.length
        for (let i = 0, j = 0; i < dataSerie1.length && j < dataSerie2.length;) {
            if (j < dataSerie2.length && (i >= dataSerie1.length || dataSerie1[i].name > dataSerie2[j].name)) {
                yAxisData.push(dataSerie2[j].name);
                j++;
            }
            else if (i < dataSerie1.length && (j >= dataSerie2.length || dataSerie1[i].name < dataSerie2[j].name)) {

                yAxisData.push(dataSerie1[i].name);
                i++;
            }
            else {
                yAxisData.push(dataSerie1[i].name);
                i++;
                j++;
            }
        }

        for (let i = 0; i < yAxisData.length; i++) {

            let found = dataSerie1.find((element: any) => yAxisData[i] == element.name);
            if (found)
                data1.push(found.value);
            else
                data1.push(0);

            found = dataSerie2.find((element: any) => yAxisData[i] == element.name);
            if (found)
                data2.push(found.value);
            else
                data2.push(0);
        }

        return {
            legend: {
                data: [serie1.name, serie2.name],
                align: 'left',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            title: {
                show: dataSerie1.length === 0 && dataSerie2.length === 0,
                textStyle: {
                    color: "grey",
                    fontSize: 20
                },
                text: "No data to display",
                left: "center",
                top: "center"
            },
            grid: {
                bottom: 10,
                top: 35,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: yAxisData
            },
            series: [
                {
                    name: serie1.name,
                    type: serie1.type,
                    data: data1,
                    // stack: 'total',
                    label: {
                        show: true,
                        formatter: (param: any) => {
                            return param.data == 0 ? '' : param.data;
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: serie2.name,
                    type: serie2.type,
                    data: data2,
                    // stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    animationDelay: (idx: number) => idx * 10 + 100,
                },
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: (idx: number) => idx * 5,
        };
    }

    doubleSeriesStackChart(dataSerie1: StatsSerie[], dataSerie2: StatsSerie[], serie1: any, serie2: any) {
        let yAxisData: string[] = [];
        let data1 = [];
        let data2 = [];

        //Assumed that dataSerie1.length>=dataSerie2.length

        yAxisData = dataSerie1.map(x => x.name);

        for (let i = 0; i < yAxisData.length; i++) {

            let found = dataSerie1.find((element: any) => yAxisData[i] == element.name);
            if (found)
                data1.push(found.value);
            else
                data1.push(0);

            found = dataSerie2.find((element: any) => yAxisData[i] == element.name);
            if (found)
                data2.push(found.value);
            else
                data2.push(0);
        }

        return {
            legend: {
                data: [serie1.name, serie2.name],
                align: 'left',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            title: {
                show: dataSerie1.length === 0 && dataSerie2.length === 0,
                textStyle: {
                    color: "grey",
                    fontSize: 20
                },
                text: "No data to display",
                left: "center",
                top: "center"
            },
            grid: {
                bottom: 10,
                top: 35,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: yAxisData
            },
            series: [
                {
                    name: serie1.name,
                    type: serie1.type,
                    data: data1,
                    // stack: 'total',
                    label: {
                        show: true,
                        formatter: (param: any) => {
                            return param.data == 0 ? '' : param.data;
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: serie2.name,
                    type: serie2.type,
                    data: data2,
                    // stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    animationDelay: (idx: number) => idx * 10 + 100,
                },
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: (idx: number) => idx * 5,
        };
    }

    singleSeriesStackChart(dataSerie1: StatsSerie[], serie1: any, color: string = "") {
        const colors = ['#546FC6', '#91CC76', '#FAC758', '#EE6666', '#72C0DD', '#3AA271', '#FC8452', '#9961B3', '#E97BCD'];
        let yAxisData: string[] = [];
        let data1 = [];

        //Assumed that dataSerie1.length>=dataSerie2.length

        yAxisData = dataSerie1.map(x => x.name);
        data1 = dataSerie1.map(x => x.value);

        return {
            legend: {
                data: [serie1.name],
                align: 'left',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            color: [color],
            title: {
                show: dataSerie1.length === 0,
                textStyle: {
                    color: "grey",
                    fontSize: 20
                },
                text: "No data to display",
                left: "center",
                top: "center"
            },
            grid: {
                bottom: 10,
                top: 35,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: yAxisData
            },
            series: [
                {
                    name: serie1.name,
                    type: serie1.type,
                    data: data1,
                    // stack: 'total',
                    label: {
                        show: true,
                        formatter: (param: any) => {
                            return param.data == 0 ? '' : param.data;
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function (params: any) {
                                return colors[params.dataIndex % colors.length];
                                // Take the index of each piece of data corresponding to the index in colors and return this color
                            }
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    animationDelay: (idx: number) => idx * 10,
                },

            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: (idx: number) => idx * 5,
        };
    }

    createGaugeChart(value: number, min: number, max: number, unit: string) {
        return {
            series: [{
                type: 'gauge',
                min: min,
                max: max,
                splitNumber: 4,
                axisLine: {
                    lineStyle: {
                        width: 10,
                        color: [
                            [0.25, '#FF6E76'],
                            [0.5, '#FDDD60'],
                            [0.75, '#58D9F9'],
                            [1, '#7CFFB2']
                        ]
                    }
                },
                pointer: {
                    length: '100%',
                    itemStyle: {
                        color: '#000'
                    }
                },
                axisTick: {
                    distance: -10,
                    length: 5,
                    splitNumber: 4,
                    lineStyle: {
                        color: '#fff',
                        width: 2
                    }
                },
                splitLine: {
                    distance: -10,
                    length: 10,
                    lineStyle: {
                        color: '#fff',
                        width: 0
                    }
                },
                axisLabel: {
                    color: 'auto',
                    distance: 15,
                    fontSize: 15
                },
                detail: {
                    valueAnimation: true,
                    formatter: function (v: number) {
                        return v.toFixed(1) + " " + unit;
                    },
                    color: 'auto'
                },
                data: [{ value }]
            }]
        };
    }

    createPieGaugeChart(value: number, min: number, max: number, unit: string) {
        const gaugeData = [
            {
                value: 20,
                name: 'ساعت',
                title: {
                    offsetCenter: ['0%', '40%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '-5%']
                }
            },

        ];
        const option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
                    pointer: {
                        show: false
                    },
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 0,
                            borderColor: '#464646'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 8
                        }
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 1
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 100,
                        fontSize: 10
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 10
                    },

                }
            ]
        };
        return option;
    }
}
