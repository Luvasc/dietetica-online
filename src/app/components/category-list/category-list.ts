 import { Component } from '@angular/core';
import { CATEGORIES, Category } from '../../services/category';
@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
 export class CategoryList {
  categories = CATEGORIES;
}