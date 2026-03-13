import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';

// Types and interfaces
interface PricingPlan {
  id: string;
  name: string;
  price: number;
  maxVideos: number;
  billing:string;
  maxDatasetSize: number;
  features: string[];
  aiPredictions: boolean;
  advancedAnalytics: boolean;
  audienceInsights: boolean;
  customReports: boolean;
  apiAccess: boolean;
  priority: boolean;
  recommended?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-pricing',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing  implements OnInit, OnDestroy {
  // Input signals
  private _currentPlan = signal<string | undefined>(undefined);
  private _externalReservedPlan = signal<string | null | undefined>(undefined);
  
  @Input()
  set currentPlan(value: string | undefined) {
    this._currentPlan.set(value);
  }
  
  @Input()
  set reservedPlan(value: string | null | undefined) {
    this._externalReservedPlan.set(value);
  }

  // Output events
  @Output() selectPlan = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();
  @Output() reservePlan = new EventEmitter<string | null>();

  // State signals
  private timeRemainingSignal = signal<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  private isPriceUnlockedSignal = signal<boolean>(false);
  private localReservedPlanSignal = signal<string | null>(null);
  private showReservationConfirmSignal = signal<boolean>(false);
  private subscription: Subscription | null = null;

  // Public readonly signals - these are functions that return values
  public timeRemaining = this.timeRemainingSignal.asReadonly();
  public isPriceUnlocked = this.isPriceUnlockedSignal.asReadonly();
  public showReservationConfirm = this.showReservationConfirmSignal.asReadonly();

  // Computed reserved plan - this is a Signal function that returns string | null | undefined
  public reservedPlanSignal: Signal<string | null | undefined> = computed(() => {
    const external = this._externalReservedPlan();
    return external !== undefined ? external : this.localReservedPlanSignal();
  });

  // Helper method to safely get reserved plan value
  public getReservedPlanValue(): string | null | undefined {
    return this.reservedPlanSignal();
  }

  // Safe check for reserved plan existence
  public hasReservedPlan(): boolean {
    return !!this.reservedPlanSignal();
  }

  // Safe check for specific plan being reserved
  public isPlanReserved(planId: string): boolean {
    const reserved = this.reservedPlanSignal();
    return reserved === planId;
  }

  // Safe check for current plan
  public isCurrentPlan(planId: string): boolean {
    return this._currentPlan() === planId;
  }

  // Pricing plans data
  public pricingPlans: PricingPlan[] = [
{
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'month',
    maxVideos: 5,
    maxDatasetSize: 100,
    aiPredictions: false,
    advancedAnalytics: false,
    audienceInsights: false,
    apiAccess: false,
    priority: false,
    customReports: false,
    features: [
      'Analyze up to 5 videos',
      'Basic analytics dashboard',
      'Dataset comparison (100 videos)',
      'Category & duration analysis',
      'Email support'
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    billing: 'month',
    maxVideos: 50,
    maxDatasetSize: 1000,
    aiPredictions: true,
    advancedAnalytics: true,
    audienceInsights: false,
    apiAccess: false,
    priority: false,
    customReports: false,
    features: [
      'Analyze up to 50 videos/month',
      'AI-powered predictions',
      'Advanced analytics & charts',
      'Dataset comparison (1,000 videos)',
      'Bubble chart visualization',
      'Performance metrics',
      'Priority email support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    billing: 'month',
    maxVideos: 200,
    maxDatasetSize: 10000,
    aiPredictions: true,
    advancedAnalytics: true,
    audienceInsights: true,
    apiAccess: true,
    priority: false,
    customReports: true,
    recommended: true,
    features: [
      'Analyze up to 200 videos/month',
      'Full AI predictions & recommendations',
      'Audience demographics analysis',
      'Dataset comparison (10,000 videos)',
      'Custom reports & exports',
      'API access',
      'Advanced audience insights',
      'Priority support with 24h response'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    billing: 'month',
    maxVideos: -1, // unlimited
    maxDatasetSize: -1, // unlimited
    aiPredictions: true,
    advancedAnalytics: true,
    audienceInsights: true,
    apiAccess: true,
    priority: true,
    customReports: true,
    features: [
      'Unlimited video analysis',
      'Unlimited dataset size',
      'White-label reporting',
      'Dedicated account manager',
      'Custom AI model training',
      'Team collaboration features',
      'Advanced API with webhooks',
      'SLA with 99.9% uptime',
      '24/7 priority support'
    ]
  }
  ];

  // Unlock date: December 31st, 2025
  private unlockDate = new Date('2025-12-31T00:00:00');

  // Form group
  pricingForm: FormGroup;

  constructor(private fb: FormBuilder , private router : Router) {
    this.pricingForm = this.fb.group({
      selectedPlan: [''],
      reservationNotes: ['']
    });
  }

  ngOnInit(): void {
    this.calculateTimeRemaining();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  private calculateTimeRemaining(): void {
    const now = new Date();
    const difference = this.unlockDate.getTime() - now.getTime();

    if (difference <= 0) {
      this.isPriceUnlockedSignal.set(true);
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    this.timeRemainingSignal.set({ days, hours, minutes, seconds });
  }

  private startCountdown(): void {
    this.subscription = interval(1000)
      .pipe(takeWhile(() => !this.isPriceUnlockedSignal()))
      .subscribe(() => {
        this.calculateTimeRemaining();
      });
  }

  private stopCountdown(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  handlePlanSelection(planId: string, isPaidPlan: boolean, showLocked: boolean , plan:any): void {
    const currentReservedPlan = this.getReservedPlanValue();
    
    if (showLocked) {
      // Reserve the plan for later
      const newReservedPlan = currentReservedPlan === planId ? null : planId;
      
      this.reservePlan.emit(newReservedPlan);
      this.localReservedPlanSignal.set(newReservedPlan);
      
      if (newReservedPlan) {
        this.showReservationConfirmSignal.set(true);
        this.pricingForm.patchValue({ selectedPlan: planId });
      }
    } else {
      // Normal plan selection
      this.selectPlan.emit(planId);
      this._currentPlan.set(planId);
      localStorage.setItem('currentPlan' ,JSON.stringify(plan))
      // this.pricingForm.patchValue({ selectedPlan: planId });
    }
  }

  onBack(): void {
    this.back.emit();
    if(this._currentPlan()){
      this.router.navigate(['/dashboard'])
    }else[
      this.router.navigate(['/landing'])
    ]
  }

  closeReservationConfirm(): void {
    this.showReservationConfirmSignal.set(false);
  }

  // Helper method to get plan by ID
  getPlanById(planId: string | null | undefined): PricingPlan | undefined {
    if (!planId) return undefined;
    return this.pricingPlans.find(p => p.id === planId);
  }

  // Format number with commas
  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  // Get reservation features based on plan
  getReservationFeatures(planId: string | null | undefined): string[] {
    if (!planId) return [];
    
    switch(planId) {
      case 'professional':
        return [
          '200 video analyses/month',
          'Advanced analytics unlocked',
          'AI predictions & insights'
        ];
      case 'starter':
        return [
          '50 video analyses/month',
          'AI predictions enabled'
        ];
      case 'enterprise':
        return [
          'Unlimited video analyses',
          'All premium features',
          'Custom integrations'
        ];
      default:
        return [];
    }
  }

  // Check if a plan is locked
  isPlanLocked(plan: PricingPlan): boolean {
    return !this.isPriceUnlockedSignal() && plan.price > 0;
  }

  // Check if a plan is recommended and not reserved
  isRecommended(plan: PricingPlan, isReserved: boolean): boolean {
    return !!plan.recommended && !isReserved;
  }
}
