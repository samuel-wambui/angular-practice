// tree-dynamic-example.component.ts
import { Component, ChangeDetectionStrategy, Injectable, inject } from '@angular/core';
import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// DynamicFlatNode represents a node in the tree with additional properties
export class DynamicFlatNode {
  constructor(
    public item: string,
    public level = 1,
    public expandable = false,
    public isLoading = false
  ) {}
}

// Service providing data for the tree
@Injectable({ providedIn: 'root' })
export class DynamicDatabase {
  dataMap = new Map<string, string[]>([
    ['Fruits', ['Apple', 'Orange', 'Banana']],
    ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    ['Apple', ['Fuji', 'Macintosh']],
    ['Onion', ['Yellow', 'White', 'Purple']],
  ]);

  rootLevelNodes: string[] = ['Fruits', 'Vegetables'];

  /** Initial data from the database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}

// DataSource for the tree, manages the expansion and fetching of nodes
export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (change.added || change.removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /** Toggle the node, add/remove children nodes from display */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const children = this._database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) {
      // No children or node not found, do nothing
      return;
    }

    node.isLoading = true;

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(
          name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name))
        );
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        ) {}
        this.data.splice(index + 1, count);
      }

      // Notify the change
      this.dataChange.next(this.data);
      node.isLoading = false;
    }, 1000);
  }
}

// Main component that displays the dynamic tree
@Component({
  selector: 'tree-dynamic-example',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <!-- Leaf Node -->
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
        <button mat-icon-button disabled></button>
        {{ node.item }}
      </mat-tree-node>

      <!-- Expandable Node -->
      <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding matTreeNodeToggle>
        <button mat-icon-button matTreeNodeToggle [attr.aria-label]="'Toggle ' + node.item">
          <mat-icon class="mat-icon-rtl-mirror">
            {{ treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right' }}
          </mat-icon>
        </button>
        {{ node.item }}
        <mat-progress-bar *ngIf="node.isLoading" mode="indeterminate" class="example-tree-progress-bar"></mat-progress-bar>
      </mat-tree-node>
    </mat-tree>
  `,
  styleUrls: ['./contact.component.css'],
})
export class TreeDynamicExample {
  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;

  constructor() {
    const database = inject(DynamicDatabase);
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database);

    this.dataSource.data = database.initialData();
  }

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
}
