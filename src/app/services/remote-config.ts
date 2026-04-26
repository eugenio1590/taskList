import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { RemoteConfig as FireRemoteConfig, fetchAndActivate, getString, getBoolean } from '@angular/fire/remote-config';

import { environment } from 'src/environments/environment';
import { ConfigurationRepository } from '../repositories/configuration.repository';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfig implements ConfigurationRepository {
  private initPromise: Promise<void> | null = null;

  constructor(
    private fireRemoteConfig: FireRemoteConfig,
    private injector: Injector
  ) { }

  private async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.fireRemoteConfig.settings.minimumFetchIntervalMillis = environment.featureFlagsRefreshIntervalMillis;

        const activated = await runInInjectionContext(this.injector, () => fetchAndActivate(this.fireRemoteConfig));

        if (activated) {
          console.log('Remote Config: New values fetched and activated');
        } else {
          console.log('Remote Config: No new updates to activate (using cached/default values)');
        }
      } catch (error) {
        console.error('Remote Config: Error during initialization', error);
        this.initPromise = null; // Allow retry on failure
        throw error;
      }
    })();

    return this.initPromise;
  }

  async getString(key: string): Promise<string> {
    await this.init();
    return runInInjectionContext(this.injector, () => getString(this.fireRemoteConfig, key));
  }

  async getBoolean(key: string): Promise<boolean> {
    await this.init();
    return runInInjectionContext(this.injector, () => getBoolean(this.fireRemoteConfig, key));
  }
}
