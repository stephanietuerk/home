export enum VizSnippet {
  BuilderExample = 'builderExample',
  DimensionInterface = 'dimensionInterface',
  ComposableTemplate = 'composableTemplate',
  ExampleTemplate = 'exampleTemplate',
  DotsRendering = 'dotsRendering',
}

export const VIZ_CODE_SNIPPETS: Record<VizSnippet, string> = {
  builderExample: `constructor(private lines: LinesConfigBuilder<MyDatum>) {}

const chartConfig = this.chart.margin(this.margin).getConfig();

const linesConfig = this.lines
  .data(data)
  .xDate((xDate) => xDate.valueAccessor((d) => d.date))
  .y((y) => y.valueAccessor((d) => d.value / 100).domainPaddingPixels(20))
  .stroke((stroke) => stroke.color((color) => color.valueAccessor((d) => d.division)))
  .pointMarkers((markers) => markers.radius(2).growByOnHover(3))
  .getConfig();`,

  dimensionInterface: `interface DataDimension<Datum> {
  valueAccessor: (d: Datum) => any;
  setPropertiesFromData(data: Datum[]): void;
  getScaleFromRange(range: [number, number]): Scale;
}`,

  composableTemplate: `<mathviz-chart>
  <primary-marks-component />
  <marks-component-1 />
  <marks-component-2 />
</mathviz-chart>`,

  exampleTemplate: `<vic-xy-chart [config]="chartConfig">
  <ng-container svg-elements>
    <svg:g vic-primary-marks-bars [config]="dataConfig" />
    <svg:g vic-x-quantitative-axis [config]="xAxisConfig" />
    <svg:g vic-y-ordinal-axis [config]="yAxisConfig" />
    <svg:g vic-quantitative-rules [config]="rulesConfig" />
  </ng-container>
</vic-xy-chart>`,

  dotsRendering: `.attr('cx', (d) => this.scales.x(d.x))
.attr('cy', (d) => this.scales.y(d.y))`,
};

export const VIZ_GLOBAL_SCALING_DIAGRAM = `
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ffffff',
    'primaryTextColor': '#2a3058',
    'primaryBorderColor': '#3491ff',
    'lineColor': '#3491ff',
    'secondaryColor': '#edf2f7',
    'tertiaryColor': '#bee3f8',
    'activationBorderColor': '#3182ce',
    'activationBkgColor': '#ebf8ff'
  }
}}%%
sequenceDiagram
    participant PrimaryMarksComponent
    participant ChartComponent
    participant AuxMarksComponent
    rect rgb(228, 234, 235)
    Note over PrimaryMarksComponent: Subscribe to scales<br/>and ranges
    Note over AuxMarksComponent: Subscribe to scales
    Note over ChartComponent: Query chart container size
    end
    rect rgb(232, 244, 248)
    ChartComponent->>PrimaryMarksComponent: Emit ranges
    Note over PrimaryMarksComponent: Create scales from data<br/> and emitted ranges
    PrimaryMarksComponent->>ChartComponent: Update scales
    ChartComponent->>PrimaryMarksComponent: Emit updated scales
    ChartComponent->>AuxMarksComponent: Emit updated scales
    Note over PrimaryMarksComponent: Draw scaled primary marks
    Note over AuxMarksComponent: Draw scaled marks
    end
    Note over ChartComponent: Chart container is resized<br/> or user-provided data changes
    rect rgb(232, 244, 248)
    ChartComponent->>PrimaryMarksComponent: Emit ranges
    Note over PrimaryMarksComponent: Update scales from data<br/> and emitted ranges
    PrimaryMarksComponent->>ChartComponent: Update scales
    ChartComponent->>PrimaryMarksComponent: Emit updated scales
    ChartComponent->>AuxMarksComponent: Emit updated scales
    Note over PrimaryMarksComponent: Draw scaled primary marks
    Note over AuxMarksComponent: Draw scaled marks
    end
`;

export const VIZ_GLOBAL_SCALING_DIAGRAM_2 = `flowchart LR
  subgraph PrimaryMarksComponent
    A1[Subscribe to scales<br/>Subscribe to ranges]:::subscribe
    A2[Emit ranges]:::emit
    A3[Create scales from data<br/>and emitted ranges]:::scale
    A4[Update scales]:::scale
    A5[Emit updated scales]:::emit
    A6[Draw scaled primary marks]:::draw
  end

  subgraph ChartComponent
    B1[Query chart container size]:::query
    B2[Emit updated scales]:::emit
  end

  subgraph MarksComponent
    C1[Subscribe to scales]:::subscribe
    C2[Draw scaled marks]:::draw
  end

  %% Resize flow
  R1[Chart container is resized]:::resize
  R2[Emit ranges]:::emit
  R3[Update scales from data<br/>and emitted ranges]:::scale
  R4[Update scales]:::scale
  R5[Emit updated scales]:::emit

  %% Connections
  A1 --> A2 --> A3 --> A4 --> A5 --> A6
  B1 --> B2 --> C2
  C1 --> C2

  R1 --> R2 --> R3 --> R4 --> R5
  R5 --> C2
  R5 --> A6

  %% Styling
  classDef subscribe fill:#F0F4F8,stroke:#bbb,stroke-width:1px,color:#333;
  classDef scale fill:#A1CFF0,stroke:#6BAED6,stroke-width:1px,color:#000;
  classDef emit fill:#FCE4A5,stroke:#E0B000,stroke-width:1px,color:#000;
  classDef draw fill:#D3E6C3,stroke:#8DBB75,stroke-width:1px,color:#000;
  classDef resize fill:#F8CFCF,stroke:#CC6666,stroke-width:1px,color:#000;
  classDef query fill:#EAE2F8,stroke:#A89FD0,stroke-width:1px,color:#000;`;
