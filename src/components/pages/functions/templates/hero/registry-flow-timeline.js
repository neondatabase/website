const TOOL_DURATION = 480;
const COMMAND_DURATION = 960;
// Each template has its own prompt, so the agent adds them as separate tasks.
// Later ones repeat the first one's beats faster, once the flow is familiar.
const REPEAT_TEMPO = 1.6;
// On the first template the agent's own steps already run 1.3x the base pace;
// later templates use REPEAT_TEMPO for them too.
const FIRST_WORK_TEMPO = 1.3;
// Hand-over pulses take their time and speed up into the block they reach. They
// keep the same length at any tempo, so every pulse travels at the same speed.
const PULSE_DURATION = 720;
// With its ease-in, the front of a pulse reaches the arrowhead at 78% of its beat.
const PULSE_ARRIVAL = 0.78;
// A finished widget with a rest gets a moment to read before the flow moves on.
// The rest keeps its length at any tempo.
const WIDGET_REST = 480;
const TEMPLATE_STEPS = [
  {
    id: 'image',
    template: 'image-generation',
    configure: 'Configuring AI Gateway',
    test: 'Testing image endpoint',
    rest: WIDGET_REST,
  },
  {
    id: 'postgres',
    template: 'rest-api-postgres',
    configure: 'Updating API routes',
    test: 'Testing /todos',
    rest: WIDGET_REST,
  },
  {
    id: 'telegram',
    template: 'telegram-bot',
    configure: 'Configuring webhook',
    test: 'Testing bot replies',
  },
];
// Widget pieces in the order the app builds them once the agent hands over, with
// their beat length. The picture starts as an even grid of small dots, then its
// hills and sun take their colour and size from the bottom up, so it gets longer beats.
const BUILD_PARTS = {
  image: [
    ['grid', 160],
    ['develop', 640],
  ],
  postgres: [
    ['row-1', 200],
    ['row-2', 200],
    ['row-3', 200],
  ],
  telegram: [
    ['message', 240],
    ['reply', 240],
  ],
};
// The light traces a widget's outline at least this long, at any tempo, and
// longer when the widget takes longer to build.
const MIN_OUTLINE = 720;
// The first appearance is one quick stagger. While the registry rows are still
// arriving, each link draws out and its window grows in where the link arrives.
// INTRO_STRETCH slows the whole first appearance evenly, starts and lengths alike.
const INTRO_STRETCH = 1.3;
const intro = (start, duration) => ({
  start: start * INTRO_STRETCH,
  end: (start + duration) * INTRO_STRETCH,
  duration: duration * INTRO_STRETCH,
});
const INTRO = {
  registry: intro(0, 300),
  rows: TEMPLATE_STEPS.map((_, index) => intro(100 + index * 100, 300)),
  input: intro(220, 220),
  agent: intro(400, 320),
  output: intro(540, 220),
  app: intro(720, 340),
};
// The story picks up the first template as the app is still settling in. From
// there it runs one beat at a time: each span starts where the previous one
// ends, so no two parts of the diagram move at once.
let cursor = INTRO.app.end - 180;
const span = (duration) => {
  const start = cursor;
  cursor += duration;
  return { start, end: cursor, duration };
};
export const FLOW_STEPS = TEMPLATE_STEPS.map(
  ({ id, template, configure, test, rest = 0 }, index) => {
    const tempo = index === 0 ? 1 : REPEAT_TEMPO;
    const beat = (duration) => span(duration / tempo);
    const workTempo = index === 0 ? FIRST_WORK_TEMPO : tempo;
    const workBeat = (duration) => span(duration / workTempo);
    // The row lights up and a pulse carries the template to the agent.
    const pick = beat(200);
    const pickup = span(PULSE_DURATION);
    // The agent starts as the pulse reaches it: the first line of the log comes
    // in right then, while the pulse's tail is still fading out.
    cursor = pickup.start + PULSE_DURATION * PULSE_ARRIVAL - 120 / workTempo;
    // The agent works through the prompt, checking off each step before the next one.
    const actions = [
      { step: 'read', label: 'Reading template', duration: TOOL_DURATION },
      {
        step: 'scaffold',
        label: 'neon functions new',
        command: `neon functions new ${template}`,
        duration: COMMAND_DURATION,
      },
      { step: 'configure', label: configure, duration: TOOL_DURATION },
      { step: 'test', label: test, duration: TOOL_DURATION },
    ].map(({ duration, step, ...action }) => {
      const { start, end } = workBeat(duration);
      workBeat(140);
      return { ...action, key: `${id}-${step}`, tempo: workTempo, start, end };
    });
    const added = workBeat(380);
    // A second pulse reaches the app. Its light runs on around the widget's outline
    // like a loading line, while the card fills in and its pieces are built inside.
    const handover = span(PULSE_DURATION);
    const land = beat(220);
    const parts = BUILD_PARTS[id].map(([part, duration]) => ({ part, ...beat(duration) }));
    const outlineEnd = Math.max(cursor, land.start + MIN_OUTLINE);
    const outline = span(outlineEnd - cursor);
    const wire = { start: land.start, end: outline.end, duration: outline.end - land.start };
    // The outline closes, the loader in the header turns into a check.
    const done = beat(180);
    span(rest);
    // The registry row turns into an installed card, then the next template is picked up.
    const settle = beat(200);
    return {
      id,
      template,
      tempo,
      start: pick.start,
      end: settle.end,
      pick,
      pickup,
      // The agent is busy from the moment the template reaches it until it reports back.
      work: { start: actions[0].start, end: added.end },
      handover,
      wire,
      land,
      parts,
      done,
      settle,
      actions: [
        ...actions,
        {
          key: `${id}-added`,
          label: `${template} added`,
          tempo: workTempo,
          start: added.start,
          end: settle.end,
          complete: true,
        },
      ],
    };
  }
);
const summary = span(380);
export const AGENT_WORK_END = summary.start;
export const STORY_DURATION = Math.round(summary.end + 200);
export const AGENT_ACTIONS = [
  ...FLOW_STEPS.flatMap(({ actions }) => actions),
  {
    key: 'complete',
    label: 'All functions added',
    tempo: 1,
    start: summary.start,
    end: STORY_DURATION,
    complete: true,
  },
];
// Curves from Emil Kowalski's motion rules: ease-out for anything entering,
// ease-in-out for things moving on screen, plain ease for colour changes, and
// ease-in for pulses that speed up into the block they reach.
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';
const EASE_IN = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
const EASE_COLOR = 'ease';
// A soft ease-in for widgets being built: the outline trace and the image's dot
// wave start a little slower and speed up towards the end.
const EASE_TRACE = 'cubic-bezier(0.11, 0, 0.5, 0)';
const TRACE_POWER = 1.6;
// Image dots change one at a time, in an order that stays the same on every build.
const DOT_DURATION = 300;
// While the agent works, its big spark spins and the small one twinkles on a loop.
const SPARK_LOOP = 2400;
// Entering cards grow from 97% rather than only fading, from where their arrow arrives.
const ENTER_SCALE = 0.97;

export const createFlowTimeline = (root) => {
  const animations = [];
  const diagram = root.querySelector('[data-flow-diagram]');
  const box = diagram.getBoundingClientRect();
  const vertical = window.matchMedia('(width < 1101px)').matches;
  const registry = root.querySelector('[data-registry]').getBoundingClientRect();
  const agent = root.querySelector('[data-agent]').getBoundingClientRect();
  const app = root.querySelector('[data-app]').getBoundingClientRect();
  const animateNode = (node, stops, easing = EASE_OUT) => {
    const animation = node.animate(
      stops.map(([time, values]) => ({ offset: time / STORY_DURATION, easing, ...values })),
      { duration: STORY_DURATION, fill: 'both' }
    );
    animation.pause();
    animation.currentTime = 0;
    animations.push(animation);
  };
  const animate = (selector, stops, easing) => {
    root.querySelectorAll(selector).forEach((node) => animateNode(node, stops, easing));
  };
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const reveal = (selector, start, duration = 220) =>
    animate(selector, [
      [0, { opacity: 0 }],
      [start, { opacity: 0 }],
      [start + duration, { opacity: 1 }],
      [STORY_DURATION, { opacity: 1 }],
    ]);
  // A small scale-in from 0.9 for check marks and other tiny state changes.
  const pop = (selector, start, duration = 220) =>
    animate(selector, [
      [0, { opacity: 0, transform: 'scale(0.9)' }],
      [start, { opacity: 0, transform: 'scale(0.9)' }],
      [start + duration, { opacity: 1, transform: 'scale(1)' }],
      [STORY_DURATION, { opacity: 1, transform: 'scale(1)' }],
    ]);
  // Cards keep their layout transform and grow in from where their arrow points.
  const enter = (selector, start, duration, base, origin) => {
    root.querySelectorAll(selector).forEach((node) => {
      node.style.transformOrigin = origin;
    });
    animate(selector, [
      [0, { opacity: 0, transform: `${base} scale(${ENTER_SCALE})` }],
      [start, { opacity: 0, transform: `${base} scale(${ENTER_SCALE})` }],
      [start + duration, { opacity: 1, transform: `${base} scale(1)` }],
      [STORY_DURATION, { opacity: 1, transform: `${base} scale(1)` }],
    ]);
  };
  // A line growing across the stage is on-screen movement.
  const draw = (selector, start, duration) =>
    animate(
      selector,
      [
        [0, { opacity: 0, strokeDashoffset: 1 }],
        [start, { opacity: 1, strokeDashoffset: 1 }],
        [start + duration, { opacity: 1, strokeDashoffset: 0 }],
        [STORY_DURATION, { opacity: 1, strokeDashoffset: 0 }],
      ],
      EASE_IN_OUT
    );
  // A light runs through a link from source to target and is gone before the next beat.
  const pulse = (link, head, spans) => {
    const linkStops = [[0, { opacity: 0, strokeDashoffset: 1 }]];
    const headStops = [[0, { opacity: 0 }]];
    spans.forEach(({ start, end, duration }) => {
      linkStops.push(
        [start, { opacity: 0, strokeDashoffset: 1 }],
        [start + 1, { opacity: 1, strokeDashoffset: 1 }],
        [end - 1, { opacity: 1, strokeDashoffset: -1 }],
        [end, { opacity: 0, strokeDashoffset: -1 }]
      );
      headStops.push(
        [start + duration * (PULSE_ARRIVAL - 0.06), { opacity: 0 }],
        [start + duration * (PULSE_ARRIVAL + 0.02), { opacity: 1 }],
        [end, { opacity: 0 }]
      );
    });
    linkStops.push([STORY_DURATION, { opacity: 0, strokeDashoffset: -1 }]);
    headStops.push([STORY_DURATION, { opacity: 0 }]);
    animate(link, linkStops, EASE_IN);
    animate(head, headStops, EASE_COLOR);
  };
  animate('[data-registry]', [
    [0, { opacity: 0 }],
    [INTRO.registry.start, { opacity: 0 }],
    [INTRO.registry.end, { opacity: 1 }],
    [STORY_DURATION, { opacity: 1 }],
  ]);
  FLOW_STEPS.forEach(({ id, pick, wire, land, parts, done, settle }, index) => {
    const row = INTRO.rows[index];
    animate(`[data-source="${id}"]`, [
      [0, { opacity: 0, transform: 'translateY(8px)' }],
      [row.start, { opacity: 0, transform: 'translateY(8px)' }],
      [row.end, { opacity: 1, transform: 'translateY(0)' }],
      [STORY_DURATION, { opacity: 1, transform: 'translateY(0)' }],
    ]);
    // Colour alone tells the state: queued templates are grey cards, the one in
    // work lights up, and an installed one settles into a solid black card.
    const queued = { backgroundColor: '#242628', color: '#7a7e83', borderColor: '#2c2f31' };
    const active = { backgroundColor: '#25292b', color: '#ededed', borderColor: '#c8d3ce' };
    const installed = { backgroundColor: '#000000', color: '#ededed', borderColor: '#45484a' };
    animate(
      `[data-source="${id}"]`,
      [
        [0, queued],
        [pick.start, queued],
        [pick.end, active],
        [settle.start, active],
        [settle.end, installed],
        [STORY_DURATION, installed],
      ],
      EASE_COLOR
    );
    // The pulse's light runs on around the widget's outline like a loading line.
    // Meanwhile the card fills in and is built; once the line closes, it settles
    // into the card's own border.
    const card = root.querySelector(`[data-capability="${id}"]`);
    const { offsetWidth: width, offsetHeight: height } = card;
    root
      .querySelector(`[data-wire="${id}"]`)
      .setAttribute('d', `M.5 .5H${width - 0.5}V${height - 0.5}H.5Z`);
    animate(
      `[data-wire="${id}"]`,
      [
        [0, { opacity: 0, strokeDashoffset: 1 }],
        [wire.start, { opacity: 1, strokeDashoffset: 1 }],
        [wire.end, { opacity: 1, strokeDashoffset: 0 }],
        [done.start, { opacity: 1, strokeDashoffset: 0 }],
        [done.end, { opacity: 0, strokeDashoffset: 0 }],
        [STORY_DURATION, { opacity: 0, strokeDashoffset: 0 }],
      ],
      EASE_TRACE
    );
    const bare = {
      opacity: 1,
      backgroundColor: 'rgba(16, 17, 18, 0)',
      borderColor: 'rgba(48, 51, 53, 0)',
    };
    const filled = { ...bare, backgroundColor: '#101112' };
    const framed = { ...filled, borderColor: '#303335' };
    animate(
      `[data-capability="${id}"]`,
      [
        [0, { ...bare, opacity: 0 }],
        [land.start, { ...bare, opacity: 0 }],
        [land.start + 1, bare],
        [land.end, filled],
        [done.start, filled],
        [done.end, framed],
        [STORY_DURATION, framed],
      ],
      EASE_COLOR
    );
    // A loader sits in the header while the widget is built, then gives way to the check.
    const loaderTurn = (time) => `rotate(${Math.round((time - land.start) * 0.45)}deg)`;
    animate(`[data-loading="${id}"]`, [
      [0, { opacity: 0, transform: loaderTurn(land.start) }],
      [land.start, { opacity: 0, transform: loaderTurn(land.start), easing: 'linear' }],
      [land.end, { opacity: 1, transform: loaderTurn(land.end), easing: 'linear' }],
      [done.start, { opacity: 1, transform: loaderTurn(done.start), easing: 'linear' }],
      [done.start + 120, { opacity: 0, transform: loaderTurn(done.start + 120) }],
      [STORY_DURATION, { opacity: 0, transform: loaderTurn(done.start + 120) }],
    ]);
    // The header comes in with the card, then the pieces are built one by one.
    [{ part: 'header', ...land }, ...parts].forEach(({ part, start, end, duration }) => {
      const selector = `[data-build="${id}-${part}"]`;
      if (id !== 'image' || part === 'header') {
        animate(selector, [
          [0, { opacity: 0, transform: 'translateY(4px)' }],
          [start, { opacity: 0, transform: 'translateY(4px)' }],
          [end, { opacity: 1, transform: 'translateY(0)' }],
          [STORY_DURATION, { opacity: 1, transform: 'translateY(0)' }],
        ]);
        return;
      }
      if (part === 'grid') {
        // The picture starts as an even grid of small dots in the sky colour.
        animate('[data-build^="image-"]:not([data-build="image-header"])', [
          [0, { opacity: 0, transform: 'none' }],
          [start, { opacity: 0, transform: 'none' }],
          [end, { opacity: 1, transform: 'none' }],
          [STORY_DURATION, { opacity: 1, transform: 'none' }],
        ]);
        return;
      }
      // Then the hill and sun dots take their colour and grow to their size in one
      // smooth wave from the bottom up, each at a slightly random moment. The wave
      // speeds up towards the top, in step with the outline trace.
      const sky = root.querySelector('[data-build="image-sky"]');
      const gridColor = sky.getAttribute('fill');
      const gridRadius = Number(sky.querySelector('circle').getAttribute('r'));
      const dotDuration = Math.min(DOT_DURATION, duration);
      root
        .querySelectorAll('[data-build="image-land"] circle, [data-build="image-sun"] circle')
        .forEach((dot) => {
          // Only the copy shown in this layout gets per-dot motion.
          if (!dot.ownerSVGElement.getBoundingClientRect().width) return;
          const rise =
            1 - Number(dot.getAttribute('cy')) / dot.ownerSVGElement.viewBox.baseVal.height;
          const wave = (rise * 0.7 + random() * 0.3) ** TRACE_POWER;
          const dotStart = start + wave * (duration - dotDuration);
          const small = {
            transform: `scale(${gridRadius / Number(dot.getAttribute('r'))})`,
            fill: gridColor,
          };
          const full = { transform: 'scale(1)', fill: dot.parentNode.getAttribute('fill') };
          dot.style.transformBox = 'fill-box';
          dot.style.transformOrigin = 'center';
          animateNode(
            dot,
            [
              [0, small],
              [dotStart, small],
              [dotStart + dotDuration, full],
              [STORY_DURATION, full],
            ],
            EASE_COLOR
          );
        });
    });
    pop(`[data-complete="${id}"]`, done.start, done.duration);
  });
  // While the agent works on a template, its big spark spins and the small one
  // twinkles on a loop; both rest while the agent waits.
  const [bigSpark, smallSpark] = root.querySelectorAll('[data-agent-mark] path');
  [bigSpark, smallSpark].forEach((spark) => {
    spark.style.transformBox = 'fill-box';
    spark.style.transformOrigin = 'center';
  });
  const turnStops = [[0, { transform: 'rotate(0deg)' }]];
  const twinkleStops = [[0, { transform: 'scale(1)' }]];
  let angle = 0;
  FLOW_STEPS.forEach(({ work }) => {
    // A whole number of quarter turns, so the spark rests upright between tasks.
    const quarters = Math.max(1, Math.round(((work.end - work.start) / SPARK_LOOP) * 4));
    turnStops.push(
      [work.start, { transform: `rotate(${angle}deg)`, easing: 'linear' }],
      [work.end, { transform: `rotate(${angle + quarters * 90}deg)` }]
    );
    angle += quarters * 90;
    const twinkle = SPARK_LOOP / 2;
    for (let time = work.start; time + twinkle <= work.end; time += twinkle) {
      twinkleStops.push(
        [time, { transform: 'scale(1)', easing: EASE_IN_OUT }],
        [time + twinkle / 2, { transform: 'scale(0.4)', easing: EASE_IN_OUT }],
        [time + twinkle, { transform: 'scale(1)' }]
      );
    }
  });
  turnStops.push([STORY_DURATION, { transform: `rotate(${angle}deg)` }]);
  twinkleStops.push([STORY_DURATION, { transform: 'scale(1)' }]);
  animateNode(bigSpark, turnStops);
  animateNode(smallSpark, twinkleStops);
  enter(
    '[data-agent]',
    INTRO.agent.start,
    INTRO.agent.duration,
    vertical ? 'translate(0)' : 'translate(-50%,-50%)',
    vertical ? '50% 0' : '0 50%'
  );
  enter(
    '[data-app]',
    INTRO.app.start,
    INTRO.app.duration,
    vertical ? 'translate(0)' : 'translateY(-50%)',
    vertical ? '50% 0' : '0 50%'
  );
  const head = (x, y) =>
    vertical
      ? `M${x - 3.5} ${y - 6}L${x} ${y}L${x + 3.5} ${y - 6}Z`
      : `M${x - 6} ${y - 3.5}L${x} ${y}L${x - 6} ${y + 3.5}Z`;
  let input, output, inputHead, outputHead;
  const linkGap = 4;
  const headBase = 5;
  if (vertical) {
    const x = box.width / 2;
    input = `M${x} ${registry.bottom - box.top + linkGap}V${agent.top - box.top - linkGap - headBase}`;
    inputHead = head(x, agent.top - box.top - linkGap);
    output = `M${x} ${agent.bottom - box.top + linkGap}V${app.top - box.top - linkGap - headBase}`;
    outputHead = head(x, app.top - box.top - linkGap);
  } else {
    const y = box.height / 2;
    input = `M${registry.right - box.left + linkGap} ${y}H${agent.left - box.left - linkGap - headBase}`;
    inputHead = head(agent.left - box.left - linkGap, y);
    output = `M${agent.right - box.left + linkGap} ${y}H${app.left - box.left - linkGap - headBase}`;
    outputHead = head(app.left - box.left - linkGap, y);
  }
  root.querySelectorAll('[data-input-link], [data-input-pulse]').forEach((path) => {
    path.setAttribute('d', input);
  });
  root.querySelectorAll('[data-input-head], [data-input-pulse-head]').forEach((path) => {
    path.setAttribute('d', inputHead);
  });
  root.querySelectorAll('[data-output-link], [data-output-pulse]').forEach((path) => {
    path.setAttribute('d', output);
  });
  root.querySelectorAll('[data-output-head], [data-output-pulse-head]').forEach((path) => {
    path.setAttribute('d', outputHead);
  });
  draw('[data-input-link]', INTRO.input.start, INTRO.input.duration);
  reveal('[data-input-head]', INTRO.input.end - 40, 80);
  draw('[data-output-link]', INTRO.output.start, INTRO.output.duration);
  reveal('[data-output-head]', INTRO.output.end - 40, 80);
  // Every template is picked up along the input link and handed to the app along the output.
  pulse(
    '[data-input-pulse]',
    '[data-input-pulse-head]',
    FLOW_STEPS.map(({ pickup }) => pickup)
  );
  pulse(
    '[data-output-pulse]',
    '[data-output-pulse-head]',
    FLOW_STEPS.map(({ handover }) => handover)
  );

  AGENT_ACTIONS.forEach(({ key, start, end, command, complete, tempo }, index) => {
    const ms = (duration) => duration / tempo;
    // The log fills from the top and runs on through every template. Once its
    // three lines are full, each new line scrolls the older ones up and out.
    const lineY = (latest) => (index - Math.max(0, latest - 2)) * 22;
    const y = lineY(index);
    const stops = [
      [0, { opacity: 0, transform: `translateY(${y + 10}px)` }],
      [start + ms(120), { opacity: 0, transform: `translateY(${y + 10}px)`, easing: EASE_OUT }],
      [start + ms(380), { opacity: 1, transform: `translateY(${y}px)` }],
    ];
    // One current action, two dim completed lines, then an exit above the feed.
    [1, 2, 3].forEach((distance) => {
      const next = AGENT_ACTIONS[index + distance];
      if (!next) return;
      const previous = stops[stops.length - 1][1];
      stops.push(
        [next.start, { ...previous, easing: EASE_OUT }],
        [
          next.start + 260 / next.tempo,
          {
            opacity: [0, 0.44, 0.18, 0][distance],
            transform: `translateY(${lineY(index + distance)}px)`,
          },
        ]
      );
    });
    stops.push([STORY_DURATION, stops[stops.length - 1][1]]);
    animate(`[data-agent-action="${key}"]`, stops);
    if (!complete) {
      animate(`[data-action-running="${key}"]`, [
        [0, { opacity: 0, transform: 'rotate(0deg)' }],
        [start, { opacity: 1, transform: 'rotate(0deg)', easing: 'linear' }],
        [end - 1, { opacity: 1, transform: 'rotate(300deg)' }],
        [end, { opacity: 0, transform: 'rotate(300deg)' }],
        [STORY_DURATION, { opacity: 0, transform: 'rotate(300deg)' }],
      ]);
    }
    // A step's check gets its own beat before the next line scrolls in.
    pop(`[data-action-complete="${key}"]`, complete ? start : end, ms(140));
    if (command) {
      command.split(' ').forEach((_, word) => {
        reveal(`[data-command-word="${key}-${word}"]`, start + ms(220 + word * 110), ms(120));
      });
    }
  });
  return animations;
};
