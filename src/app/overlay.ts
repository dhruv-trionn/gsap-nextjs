import gsap from 'gsap';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface OverlayOptions {
  rows: number;
  columns: number;
}

interface AnimationConfig {
  transformOrigin?: string;
  duration?: number;
  ease?: gsap.EaseString;
  stagger?: gsap.StaggerVars;
}

/* -------------------------------------------------------------------------- */
/*                                   Cell                                     */
/* -------------------------------------------------------------------------- */

class Cell {
  DOM: {
    el: HTMLDivElement;
  };

  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.DOM = {
      el: document.createElement('div'),
    };

    gsap.set(this.DOM.el, { willChange: 'opacity, transform' });

    this.row = row;
    this.column = column;
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Overlay                                   */
/* -------------------------------------------------------------------------- */

export class Overlay {
  DOM: {
    el: HTMLElement;
  };

  cells: Cell[][] = [];

  options: OverlayOptions = {
    rows: 10,
    columns: 10,
  };

  constructor(DOM_el: HTMLElement, customOptions: Partial<OverlayOptions> = {}) {
    this.DOM = { el: DOM_el };

    // Merge options
    this.options = {
      ...this.options,
      ...customOptions,
    };

    // CSS variable
    this.DOM.el.style.setProperty('--columns', String(this.options.columns));

    // Create grid
    this.cells = Array.from({ length: this.options.rows }, (_, row) =>
      Array.from({ length: this.options.columns }, (_, col) => {
        const cell = new Cell(row, col);
        this.DOM.el.appendChild(cell.DOM.el);
        return cell;
      })
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                                   Show                                   */
  /* ------------------------------------------------------------------------ */

  show(customConfig: AnimationConfig = {}): Promise<void> {
    return new Promise((resolve) => {
      const defaultConfig: AnimationConfig = {
        transformOrigin: '50% 50%',
        duration: 0.5,
        ease: 'none',
        stagger: {
          grid: [this.options.rows, this.options.columns],
          from: 0,
          each: 0.05,
          ease: 'none',
        },
      };

      const config = { ...defaultConfig, ...customConfig };

      gsap.set(this.DOM.el, { opacity: 1 });

      gsap.fromTo(
        this.cells.flat().map((cell) => cell.DOM.el),
        {
          scaleX: 0,
          transformOrigin: config.transformOrigin,
        },
        {
          scale: 1.01,
          duration: config.duration,
          ease: config.ease,
          stagger: config.stagger,
          onComplete: () => resolve(),
        }
      );
    });
  }

  /* ------------------------------------------------------------------------ */
  /*                                   Hide                                   */
  /* ------------------------------------------------------------------------ */

  hide(customConfig: AnimationConfig = {}): Promise<void> {
    return new Promise((resolve) => {
      const defaultConfig: AnimationConfig = {
        transformOrigin: '50% 50%',
        duration: 0.5,
        ease: 'none',
        stagger: {
          grid: [this.options.rows, this.options.columns],
          from: 0,
          each: 0.05,
          ease: 'none',
        },
      };

      const config = { ...defaultConfig, ...customConfig };

      gsap.fromTo(
        this.cells.flat().map((cell) => cell.DOM.el),
        {
          transformOrigin: config.transformOrigin,
        },
        {
          scaleX: 0,
          duration: config.duration,
          ease: config.ease,
          stagger: config.stagger,
          onComplete: () => resolve(),
        }
      );
    });
  }
}
