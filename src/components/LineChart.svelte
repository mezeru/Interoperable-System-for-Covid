<script>
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

  export const handleDate = (value) => {
    return new Intl.DateTimeFormat("en-GB", {
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h12",
    }).format(new Date(value.replace("Etc/UTC", "Z")));
  };

  import { onMount } from "svelte";
  let chart;
  let element;
  let ctx;
  export let label;
  export let color = "rgb(255, 99, 132)";
  export let labels;
  export let min;
  export let max;
  export let data;
  onMount(() => {
    const chartElement = element;
    ctx = chartElement.getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels.map((x) => handleDate(x)).reverse(),
        datasets: [
          {
            data: data.reverse(),
            label,
            borderColor: color,
            backgroundColor: color,
            tension: 0.01,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          y: {
            suggestedMax: max,
            suggestedMin: min,
          },
        },
      },
    });
  });
</script>

<canvas bind:this={element} width="100px" height="75px" />
