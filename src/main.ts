import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Echo from 'laravel-echo';
declare global {
  interface Window {
    Echo: any;
  }
}

window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: `${window.location.protocol}//${window.location.hostname}:6001`,
  withCredentials: true,
  // auth: {
  //   headers: {
  //     Authorization: "Bearer " + token,
  //   },
  // },
});

window.Echo.channel('public.channel').listen('PublicChannel', (data: any) => {
  console.log(data);
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
