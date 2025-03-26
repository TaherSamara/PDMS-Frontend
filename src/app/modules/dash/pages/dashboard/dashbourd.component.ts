import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ApiService } from '../../services/api.service';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  numbers: number[] = [0, 0, 0, 0];
  targetNumbers: number[] = [0, 0, 0, 0];
  duration: number = 2000;
  startTime: number;
  interval: any;

  constructor(public publicService: PublicService, public httpService: HttpService, private api: ApiService) { }

  ngOnInit(): void {
    this.statistics();
    this.interval = setInterval(() => {
      this.statistics();
    }, 1000 * 60);
  }

  statistics() {
    this.httpService.list(this.api.dashboard.statistics, {}).subscribe({
      next: (res: any) => {
        const newTargetNumbers = [
          res.data?.total_count || 0,
          res.data?.online_count || 0,
          res.data?.offline_short_term_count || 0,
          res.data?.offline_long_term_count || 0
        ];

        this.targetNumbers = [...newTargetNumbers];
        this.startTime = performance.now();
        this.animateNumbers();
      }
    });
  }

  animateNumbers(): void {
    const initialNumbers = [...this.numbers];

    const animate = (timestamp: number) => {
      const elapsedTime = timestamp - this.startTime;
      let progress = elapsedTime / this.duration;

      progress = Math.min(1, 1 - Math.pow(1 - progress, 3));

      this.numbers.forEach((_, index) => {
        const difference = this.targetNumbers[index] - initialNumbers[index];
        this.numbers[index] = Math.round(initialNumbers[index] + difference * progress);
      });

      if (elapsedTime < this.duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
