import { Injectable } from '@angular/core';
import {Section} from './types';
import sections from '../../assets/data/sections.json';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  constructor() { }

  public getAll(): Section[] {
    return Object.values(sections);
  }
}
