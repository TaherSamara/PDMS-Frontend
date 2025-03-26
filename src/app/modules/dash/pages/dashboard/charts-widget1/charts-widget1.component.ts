import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/modules/dash/services/api.service';
import { HttpService } from 'src/app/modules/dash/services/http.service';
import { ChartComponent } from 'ng-apexcharts';
import { PublicService } from '../../../services/public.service';

@Component({
  selector: 'app-charts-widget1',
  templateUrl: './charts-widget1.component.html',
  styleUrls: ['./charts-widget1.component.css']
})
export class ChartsWidget1Component implements OnDestroy {
  @ViewChild('chart') chart: ChartComponent;
  chartOptions: any = {};
  refreshInterval: any;

  constructor(public publicService: PublicService, private httpService: HttpService, private api: ApiService) { }

  ngOnInit() {
    this.loadChart();
    this.refreshInterval = setInterval(() => {
      this.updateChartData();
    }, 1000 * 60);
  }

  loadChart() {
    this.chartOptions = this.getChartOptions();

    this.httpService.list(this.api.dashboard.statisticsByMonth, {}).subscribe({
      next: (res: any) => {
        const stableDevices = res.data.map((item: any) => item.stable_devices);
        const unstableDevices = res.data.map((item: any) => item.unstable_devices);
        const months = res.data.map((item: any) => item.month);

        this.chartOptions = this.getChartOptions(stableDevices, unstableDevices, months);
      }
    });
  }

  updateChartData() {
    this.httpService.list(this.api.dashboard.statisticsByMonth, {}).subscribe({
      next: (res: any) => {
        const stableDevices = res.data.map((item: any) => item.stable_devices);
        const unstableDevices = res.data.map((item: any) => item.unstable_devices);

        if (this.chart) {
          this.chart.updateSeries([
            { name: "Stable Devices", data: stableDevices },
            { name: "Unstable Devices", data: unstableDevices }
          ]);
        }
      },
      error: (err) => console.error("Error updating chart data", err)
    });
  }

  getChartOptions(stable: number[] = [], unstable: number[] = [], months: string[] = []) {
    return {
      series: [
        { name: "Stable Devices", data: stable },
        { name: "Unstable Devices", data: unstable }
      ],
      chart: {
        height: (this.publicService.innerHeight - 335),
        type: "area",
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: {
        type: "category",
        categories: months.length ? months : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        tickPlacement: "on",
        labels: { style: { fontSize: '12px' } }
      },
      yaxis: { labels: { style: { fontSize: '12px' } } },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      colors: ["#28a745", "#dc3545"]
    };
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
