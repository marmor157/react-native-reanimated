'use strict';
import type { ShadowNodeWrapper } from '../commonTypes';
import {
  isChromeDebugger,
  isFabric,
  isJest,
  shouldBeUseWeb,
} from '../PlatformChecker';
import type { AnimatedRef, AnimatedRefOnUI } from '../hook/commonTypes';
import type { Component } from 'react';

type DispatchCommand = <T extends Component>(
  animatedRef: AnimatedRef<T>,
  commandName: string,
  args?: unknown[]
) => void;

export let dispatchCommand: DispatchCommand;

function dispatchCommandFabric(
  animatedRef: AnimatedRefOnUI,
  commandName: string,
  args: Array<unknown> = []
) {
  'worklet';
  if (!_WORKLET) {
    return;
  }

  const shadowNodeWrapper = animatedRef() as ShadowNodeWrapper;
  _dispatchCommandFabric!(shadowNodeWrapper, commandName, args);
}

function dispatchCommandPaper(
  animatedRef: AnimatedRefOnUI,
  commandName: string,
  args: Array<unknown> = []
) {
  'worklet';
  if (!_WORKLET) {
    return;
  }

  const viewTag = animatedRef() as number;
  _dispatchCommandPaper!(viewTag, commandName, args);
}

function dispatchCommandJest() {
  console.warn('[Reanimated] dispatchCommand() is not supported with Jest.');
}

function dispatchCommandChromeDebugger() {
  console.warn(
    '[Reanimated] dispatchCommand() is not supported with Chrome Debugger.'
  );
}

function dispatchCommandDefault() {
  console.warn(
    '[Reanimated] dispatchCommand() is not supported on this configuration.'
  );
}

if (!shouldBeUseWeb()) {
  // Those casts are actually correct since on Native platforms `AnimatedRef` is
  // registered with `RegisterShareableMapping` as a different function than
  // actual `AnimatedRef` and TypeScript cannot know that.
  if (isFabric()) {
    dispatchCommand = dispatchCommandFabric as unknown as DispatchCommand;
  } else {
    dispatchCommand = dispatchCommandPaper as unknown as DispatchCommand;
  }
} else if (isJest()) {
  dispatchCommand = dispatchCommandJest;
} else if (isChromeDebugger()) {
  dispatchCommand = dispatchCommandChromeDebugger;
} else {
  dispatchCommand = dispatchCommandDefault;
}
