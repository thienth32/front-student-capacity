import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[countUp]'
})
export class CountUpDirective implements OnInit, OnDestroy {

  @Input() countUp: number = 0;
  @Input() duration: number = 2000;

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {

    this.observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {
          this.animate();
        } else {
          // reset về 0 khi scroll ra ngoài
          this.el.nativeElement.innerText = '0';
        }

      },
      {
        threshold: 0.6
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  animate() {

    const start = 0;
    const end = this.countUp;
    const duration = this.duration;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const startTime = performance.now();

    const update = (currentTime: number) => {

      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = easeOut(progress);

      const value = Math.floor(easedProgress * (end - start) + start);

      this.el.nativeElement.innerText = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}