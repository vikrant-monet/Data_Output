import { Component, EventEmitter, Input, OnInit, Output, Signal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StatsOverview } from '../stats-overview/stats-overview';
import { BubbleChart } from '../bubble-chart/bubble-chart';
import { SecondaryCategoryDistribution } from '../secondary-category-distribution/secondary-category-distribution';
import { Api } from '../../services/api';
import { SecondaryCategoryPlatform } from '../secondary-category-platform/secondary-category-platform';

// Import types
// import { VideoMetadata } from '../../types/video';
interface VideoMetadata {
  id: string;
  title: string;
  category: string;
  secondaryCategory?: string;
  duration: number;
  platform?: string;
  views?: number;
  engagement?: number;
  // ... other properties
}

@Component({
  selector: 'app-overview',
  imports: [CommonModule, ReactiveFormsModule , StatsOverview , BubbleChart , SecondaryCategoryDistribution , SecondaryCategoryPlatform],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview  implements OnInit {
  // Private signal for internal state
  private selectedVideoSignal = signal<VideoMetadata | null>(null);
  
  // Public readonly signal for template
  public selectedVideo = this.selectedVideoSignal.asReadonly();
  
  // Input setter that updates the signal
  @Input()
  set selectedVideoInput(value: VideoMetadata | null) {
    this.selectedVideoSignal.set(value);
  }
@Input() distribution!:any;
@Input() platform!: any;

  @Output() setVideoForm = new EventEmitter<any>()
  setShow = signal<boolean>(false);
  
  // Output events (using outputs instead of callbacks)
  // @Output() uploadClick = new EventEmitter<void>();

  // Computed signals
  testingCategories = ['Ad Testing', 'Movie Testing', 'Concept Testing', 'A/B Testing', 'UX Testing'];

  
  isTestingCategory: Signal<boolean> = computed(() => {
    const video = this.selectedVideo();
    return video ? this.testingCategories.includes(video.category) : false;
  });

  // Stats for the header
  stats = signal({
    videosAnalyzed: 1000,
    platformsTracked: 9
  });

  // Form group for any form functionality
  dashboardForm: FormGroup;

  constructor(private fb: FormBuilder , private api : Api) {
    // Initialize reactive form if needed
    this.dashboardForm = this.fb.group({
      // Add form controls as needed
      searchControl: [''],
      filterControl: ['all']
    });
  }

  ngOnInit(): void {
    // Any initialization logic
    // console.log(this.distribution,'fsdfasfsadfs');
    
  }

  // Animation state signal
  animationState = signal<'idle' | 'animating'>('idle');

  onUploadClick(): void {
    // this.uploadClick.emit();
    // For now, we'll just log
    // console.log('Upload clicked');
    this.animationState.set('animating');
    this.setShow.set(!this.setShow())
    this.setVideoForm.emit(this.setShow());
    // Reset animation state after delay
    setTimeout(() => {
      this.animationState.set('idle');
    }, 500);
  }

  // Helper method to get gradient style based on category
  getCategoryGradient(category: string): string {
    const gradients: Record<string, string> = {
      'Ad Testing': 'from-blue-600 via-blue-500 to-indigo-600',
      'Movie Testing': 'from-purple-600 via-purple-500 to-pink-600',
      'Concept Testing': 'from-green-600 via-green-500 to-teal-600',
      'A/B Testing': 'from-orange-600 via-orange-500 to-red-600',
      'UX Testing': 'from-indigo-600 via-indigo-500 to-purple-600'
    };
    
    return gradients[category] || 'from-indigo-600 via-purple-600 to-pink-500';
  }

  // Form submission handler example
  onSubmit(): void {
    if (this.dashboardForm.valid) {
      // console.log('Form submitted:', this.dashboardForm.value);
      // Handle form submission
    }
  }


}