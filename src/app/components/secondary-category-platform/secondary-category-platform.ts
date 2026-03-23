import { Component, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-secondary-category-platform',
  imports: [],
  templateUrl: './secondary-category-platform.html',
  styleUrl: './secondary-category-platform.scss',
})
export class SecondaryCategoryPlatform  implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() platform: any;

  private chart: any;
  private resizeObserver?: ResizeObserver;

//   platformSignal = signal([
//   { name: 'Amazon Prime', value: 141, isSelected: false, color: '#0ea5e9' },
//   { name: 'TikTok', value: 120, isSelected: false, color: '#f43f5e' },
//   { name: 'Instagram Reels', value: 119, isSelected: false, color: '#22c55e' },
//   { name: 'YouTube', value: 116, isSelected: false, color: '#a855f7' },
//   { name: 'Netflix', value: 111, isSelected: false, color: '#ec4899' },
//   { name: 'YouTube Kids', value: 109, isSelected: false, color: '#f97316' },
//   { name: 'Peacock TV', value: 98, isSelected: false, color: '#06b6d4' },
//   { name: 'Snapchat', value: 94, isSelected: false, color: '#eab308' },
//   { name: 'Disney+', value: 92, isSelected: false, color: '#14b8a6' }
// ]);

 platformSignal = signal<any>('');

  ngOnInit(): void {
    if (this.platform()?.length) {
      this.platformSignal.set(this.platform());
    }
  }

  ngAfterViewInit() {
    this.initializeChart();
    this.setupResizeObserver();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.resizeObserver?.disconnect();
  }

  private initializeChart() {
    const categories = this.platformSignal();

    const maxValue = Math.max(...categories.map((c: any) => c.value));

    // dynamic scaling
    const tickInterval = Math.ceil(maxValue / 5 / 10) * 10;
    const yAxisMax = tickInterval * 5;

    this.chart = Highcharts.chart(this.chartContainer.nativeElement, {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        spacing: [10, 20, 30, 10],
        height: '70%',
        style: {
          fontFamily: 'inherit'
        }
      },

      title: { text: undefined },

      xAxis: {
        categories: categories.map((c: any) => c.name),
        lineWidth: 1,
        lineColor: '#000',
        gridLineWidth: 0,
        labels: {
          style: {
            color: '#4b5563',
            fontSize: '13px'
          }
        }
      },

      yAxis: {
        min: 0,
        max: yAxisMax,
        tickInterval: tickInterval,
        startOnTick: true,
        endOnTick: true,
        title: { text: null },

        lineWidth: 2,
        lineColor: '#000',

        tickWidth: 1,
        tickLength: 6,
        tickColor: '#000',
        tickPosition: 'outside',

        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#d1d5db',

        labels: {
          // formatter: function () {
          //   if (this.value >= 1000) {
          //     return (this.value / 1000) + 'k';
          //   }
          //   return this.value;
          // },
          style: {
            color: '#666',
            fontSize: '12px'
          }
        }
      },

      legend: {
        enabled: false,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          color: '#374151',
          fontSize: '13px'
        },
        symbolRadius: 2
      },

      tooltip: {
        backgroundColor: 'white',
        borderColor: '#e2e8f0',
        borderRadius: 6,
        shadow: true,
        formatter: function (this: any) {
          return `<b>${this.key}</b><br/><div style="margin-top:5px">Videos: ${this.y}</div>`;
        }
      },

      plotOptions: {
        bar: {
          borderRadius: 6,
          groupPadding: 0.08,
          pointPadding: 0.04,
          borderWidth: 0,
          states: {
            hover: {
              brightness: 0.1
            }
          }
        }
      },

      series: [
        {
          name: 'Videos',
          type: 'bar',
          color: 'black',
          data: categories.map((c: any) => ({
            y: c.value,
            color: c.color,
            // opacity: 0.7,
            borderColor: c.isSelected ? '#000000' : 'transparent',
            borderWidth: c.isSelected ? 2 : 0
          }))
        }
      ],

      credits: { enabled: false }
    });
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.chart?.reflow();
      });

      this.resizeObserver.observe(this.chartContainer.nativeElement);
    }
  }
}