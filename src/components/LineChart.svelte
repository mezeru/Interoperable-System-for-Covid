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
    // @ts-ignore
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

  const handleDate = (value) => {
    let time;

    time = new Date(value);

    return (
      time.getDay().toString() +
      "/" +
      time.getMonth().toString() +
      "/" +
      time.getFullYear().toString() +
      "  " +
      time.getHours().toString() +
      ":" +
      time.getMinutes().toString()
    );
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
    console.log(label);
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
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 8,
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

<canvas bind:this={element} width="100px" height="60px" />
