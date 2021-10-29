<!-- <script lang="ts">
  import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle,
  } from "chart.js";
  import { onMount } from "svelte";

  Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
  );

  let ctx;
  let row;
  let element;
  let chart;
  export let labels;
  export let label;
  let color;

  const handleName = (row, key) => {
    switch (key) {
      case "Time":
        let time = new Date(row.value);
        return (
          time.getDay().toString() +
          "/" +
          time.getMonth().toString() +
          "/" +
          time.getFullYear().toString() +
          "<br/>" +
          time.getHours().toString() +
          ":" +
          time.getMinutes().toString()
        );

      case "SpO2":
        return row.numerator;

      case "Temperature":
      case "Pulse_Rate":
        return row.magnitude;
    }
    return row.value;
  };

  const handleData = (row, labels) => {
    let data = [];
    row.forEach((com) => {
      if (labels.include(com[0])) {
        data.push(handleName(com[0], label));
      }
    });
  };

  onMount(() => {
    const chartElement = element as HTMLCanvasElement;
    ctx = chartElement.getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            data: handleData(row, labels),
            label: label,
            borderColor: color,
            backgroundColor: color,
            tension: 0.1,
          },
        ],
      },
    });
  });
</script>

<canvas bind:this={element} width="400" height="400" id="myChart" /> -->
