import { Component, Input, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StatMetric {
  id: string;
  title: string;
  subtitle: string;
  value: string | number;
  icon: string;
  gradient: string;
  industryValue?: string | number;
  comparison?: {
    value: string;
    color: string;
    label: string;
    direction: 'up' | 'down';
  };
}

@Component({
  selector: 'app-stats-overview',
  imports: [],
  templateUrl: './stats-overview.html',
  styleUrl: './stats-overview.scss',
})

export class StatsOverview {
  // Signals for state management
  private showComparisonSignal = signal<boolean>(false);
  
  // Public readonly signals
  public showComparison = this.showComparisonSignal.asReadonly();
  
  // Computed header subtitle
  public headerSubtitle: Signal<string> = computed(() => 
    this.showComparison() 
      ? 'Comparing with industry standards' 
      : 'Key metrics at a glance'
  );

  // Metrics data signal
  public metrics = signal<StatMetric[]>([
    {
      id: 'views',
      title: 'Total Views',
      subtitle: 'Cumulative reach',
      value: '15.7M',
      icon: 'eye',
      gradient: 'from-blue-500 to-cyan-500',
      industryValue: '18.5M',
      comparison: {
        value: '14.9%',
        color: 'rose',
        label: 'Improving',
        direction: 'down'
      }
    },
    {
      id: 'engagement',
      title: 'Avg Engagement',
      subtitle: 'Interaction rate',
      value: '76.2%',
      icon: 'trending-up',
      gradient: 'from-emerald-500 to-teal-500',
      industryValue: '3.2%',
      comparison: {
        value: '2279.9%',
        color: 'emerald',
        label: 'Excellent!',
        direction: 'up'
      }
    },
    {
      id: 'duration',
      title: 'Avg Duration',
      subtitle: 'Content length',
      value: '15 min',
      icon: 'clock',
      gradient: 'from-purple-500 to-pink-500',
      industryValue: '7 min',
      comparison: {
        value: '117.6%',
        color: 'emerald',
        label: 'Excellent!',
        direction: 'up'
      }
    },
    {
      id: 'platforms',
      title: 'Platforms',
      subtitle: 'Active channels',
      value: '9',
      icon: 'monitor-play',
      gradient: 'from-orange-500 to-red-500',
      industryValue: '6',
      comparison: {
        value: '50.0%',
        color: 'emerald',
        label: 'Excellent!',
        direction: 'up'
      }
    },
    {
      id: 'videos',
      title: 'Total Videos',
      subtitle: 'Dataset size',
      value: '1,000',
      icon: 'users',
      gradient: 'from-indigo-500 to-violet-500',
      industryValue: '750',
      comparison: {
        value: '33.3%',
        color: 'emerald',
        label: 'Excellent!',
        direction: 'up'
      }
    }
  ]);

  // Toggle comparison mode
  toggleComparison(): void {
    // this.showComparisonSignal.update(value => !value);
  }

  // Optional: Method to update metrics data dynamically
  updateMetrics(newMetrics: StatMetric[]): void {
    this.metrics.set(newMetrics);
  }

  // Optional: Method to update a single metric
  updateMetric(metricId: string, updates: Partial<StatMetric>): void {
    this.metrics.update(metrics => 
      metrics.map(metric => 
        metric.id === metricId ? { ...metric, ...updates } : metric
      )
    );
  }
}
