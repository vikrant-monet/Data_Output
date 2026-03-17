import { Component, OnInit, Signal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from '../header/header';
import { Overview } from '../../components/overview/overview';
import { RouterLink } from "@angular/router";
import { Api } from '../../services/api';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Tab {
  id: string;
  label: string;
  shortLabel: string;
  isPro?: boolean;
}

interface Video {
  // Define your video interface properties here
  id?: string;
  title?: string;
  // ... other properties
}


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, Header, Overview, RouterLink , MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  // Signals for state management
  private activeTabSignal = signal<string>('overview');
  private mobileMenuOpenSignal = signal<boolean>(false);
  private showUploadFormSignal = signal<boolean>(false);
  private selectedVideoSignal = signal<Video | null>(null);
  private isDemoModeSignal = signal<boolean>(true); // Set based on your logic
  private reservedPlanSignal = signal<string | null>(null);
  private viewSignal = signal<string>('dashboard');
  
  // Computed signals
  activeTab = this.activeTabSignal.asReadonly();
  mobileMenuOpen = this.mobileMenuOpenSignal.asReadonly();
  showUploadForm = this.showUploadFormSignal.asReadonly();
  selectedVideo = this.selectedVideoSignal.asReadonly();
  isDemoMode = this.isDemoModeSignal.asReadonly();
  reservedPlan = this.reservedPlanSignal.asReadonly();
  view = this.viewSignal.asReadonly();
  activePlan = signal<boolean>(true);
  dropDownData = signal<any>('');
  loader = signal<boolean>(false);

  // Tabs configuration
  readonly tabs: Tab[] = [
    { id: 'overview', label: 'Overview', shortLabel: 'Overview' },
    { id: 'category', label: 'Category Analysis', shortLabel: 'Category' },
    { id: 'theme', label: 'Theme Analysis', shortLabel: 'Theme' },
    { 
      id: 'demographics', 
      label: 'Audience Demographics', 
      shortLabel: 'Audience',
      isPro: !this.hasFeatureAccess('professional')
    },
    { id: 'platform', label: 'Platform Simulation', shortLabel: 'Platform' },
    { id: 'testing', label: 'Testing Analysis', shortLabel: 'Testing' }
  ];

  // Form group for any form functionality
  videoForm: FormGroup;

  constructor(private fb: FormBuilder , private _api : Api) {
    this.videoForm = this.fb.group({
     title : [ '' , Validators.required],
     category : [ '' , Validators.required],
     s_category : [ '' , Validators.required],
     theme : [ '' , Validators.required],
     duration : [ '' , Validators.required],
     target_demographics : [ '' , Validators.required],
     banner_style : [ '' , Validators.required],
     target_platform : [ '' , Validators.required],
     ott_platoform : [ '' , Validators.required]
    });
  }

    COLORS = [
    '#0ea5e9', '#f43f5e', '#22c55e', '#a855f7', '#ec4899',
    '#f97316', '#06b6d4', '#eab308', '#a855f7', '#14b8a6',
    '#fb923c', '#c026d3', '#10b981', '#6366f1', '#84cc16'
  ];
  distribution = signal<any>('');
  platform = signal<any>('');

  ngOnInit(): void {
    // Any initialization logic
    if(localStorage.getItem('currentPlan')){
      const value = localStorage.getItem('currentPlan')
      if(value){
        const plan = JSON.parse(value);
        this.activePlan.set(true);
      }else{
        // this.activePlan.set(false);
      }
    }
    this.videoForm.get('theme')?.disable();
    this.videoForm.get('banner_style')?.disable()

    this.videoForm.get('category')?.valueChanges.subscribe((res:any) => {
      if(res){
          this.videoForm.get('theme')?.enable();
      }
    })
      this.videoForm.get('theme')?.valueChanges.subscribe((res:any) => {
      if(res){
        // console.log(res);
        
          this.videoForm.get('banner_style')?.enable();
      }
    })

    this.getFormData('/dropdownData');
  }

  getFormData(endpoint:string){
    this._api.getApi(endpoint).subscribe((res:any) => {
      if(res && !res.error){
        if(res.data){
          // console.log(res.data, 'response of the api');
          let obj:any = {};
          let allData:any;
           allData = res.data.map((it:any , i:any) => {
            it.property.map((pp:any , j:any) => {
              if(pp.name == 'businessProperties'){
                pp.filters.map((ff:any , k:any) => {
                  if(ff.name.toLowerCase() == 'industry' || ff.name.toLowerCase() == 'category' || ff.name == 'Promotion Platform/Channel'){
                    obj[ff.name] = ff.values
                  }
                })
              }
              else if(pp.name == 'Technical Properties'){
                pp.filters.map((ff:any , k:any) => {
                  if(ff.name.toLowerCase() == 'genre'){
                    obj[ff.name] = ff.values
                  }
                })
              }
            })
            // console.log(obj,'fsfsfsaf')
            return obj
          })
          this.dropDownData.set(allData);
          // console.log(this.dropDownData(),'i am the dropdown data');
        }
      }
    })
  }

  // Feature access check
  hasFeatureAccess(plan: string): boolean {
    // Implement your feature access logic here
    // This could be based on user subscription, demo mode, etc.
    return false; // Placeholder
  }

  // Signal-based computed property for current tab
  currentTab: Signal<Tab | undefined> = computed(() => 
    this.tabs.find(t => t.id === this.activeTab())
  );

  // Methods to update signals
  setActiveTab(tabId: string): void {
    this.activeTabSignal.set(tabId);
  }

  setMobileMenuOpen(isOpen: boolean): void {
    this.mobileMenuOpenSignal.set(isOpen);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpenSignal.update(prev => !prev);
  }

  setShowUploadForm(show: boolean): void {
    // console.log('inside show  uploadform',show);
    
    this.showUploadFormSignal.set(show);
  }

  handleUploadClick(): void {
    this.setShowUploadForm(true);
  }

  handleVideoAnalyzed(video: Video): void {
    this.selectedVideoSignal.set(video);
    this.setShowUploadForm(false);
  }

  setView(view: string): void {
    this.viewSignal.set(view);
  }

  handleVideoUpload(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;

  const fileName = file.name;

  const video = document.createElement('video');
  video.preload = 'metadata';

  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src);

    const duration = Math.floor(video.duration);
    
    const formData = new FormData();
    formData.append('video', file);
    formData.append('fileName', fileName);
    formData.append('duration', duration.toString());
    // console.log(fileName , duration , video);

    // this.uploadVideo(formData);
    this.videoForm.get('title')?.setValue(fileName);
    this.videoForm.get('duration')?.setValue(+duration)
  };


  video.src = URL.createObjectURL(file);
}

submit(){
    this.getCategoryData('/graph-count');
}
  getCategoryData(endpoint:string){
    this.loader.set(true);
    this._api.getApi(endpoint).subscribe((res:any) => {
      this.loader.set(false);
      if(res && res.data){
        // console.log(res);
        const distribution = res.data.Industry.map((it:any , i:any) => {
          it['color'] = this.COLORS[i];
          return it;
        })
        const platform = res.data.platform.map((it:any , i:any) => {
          it['color'] = this.COLORS[i];
          return it;
        })
        this.distribution.set(distribution);
        this.platform.set(platform)
        // console.log(this.distribution() , this.platform());
        
      }
    })
  }

  // Getter for Dashboard component (to be implemented)
  get DashboardComponent(): any {
    // Return your Dashboard component reference
    return null;
  }

  // Getter for other components
  get CategoryPerformanceComponent(): any {
    return null; // Replace with actual component
  }

  get ThemePerformanceComponent(): any {
    return null; // Replace with actual component
  }

  get PlatformPerformanceComponent(): any {
    return null; // Replace with actual component
  }

  get TestingAnalysisMetricsComponent(): any {
    return null; // Replace with actual component
  }

  get AudienceDemographicsComponent(): any {
    return null; // Replace with actual component
  }

  get PredictionPanelComponent(): any {
    return null; // Replace with actual component
  }

  get VideoUploadFormComponent(): any {
    return null; // Replace with actual component
  }
}
