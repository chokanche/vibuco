import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("flags are deterministic, audited, and fail off", () => {
  const url = new URL("../../src/platform/flags/evaluator.ts", import.meta.url).href;
  const source = `import { registerHooks } from 'node:module'; registerHooks({resolve(s,c,n){if(s.startsWith('.')&&c.parentURL?.endsWith('.ts'))return {shortCircuit:true,url:new URL(s+'.ts',c.parentURL).href};return n(s,c)}}); const {createFlagEvaluator}=await import(${JSON.stringify(url)}); const flag={key:'target_auth',owner:'identity',purpose:'pilot',expiresAt:'2099-01-01T00:00:00Z',defaultValue:false,actorIds:['actor-1']}; const e=createFlagEvaluator({get:async()=>flag}); const broken=createFlagEvaluator({get:async()=>{throw new Error('down')}}); console.log(JSON.stringify({cohort:await e.evaluate('target_auth',{actorId:'actor-1'}),anonymous:await e.evaluate('target_auth',{}),failed:await broken.evaluate('target_auth',{}),events:e.auditEvents(),failedEvents:broken.auditEvents()}));`;
  const child = spawnSync(process.execPath,["--conditions=react-server","--input-type=module","--eval",source],{encoding:"utf8"});
  assert.equal(child.status,0,child.stderr);
  const result=JSON.parse(child.stdout);
  assert.equal(result.cohort,true); assert.equal(result.anonymous,false); assert.equal(result.failed,false);
  assert.deepEqual(result.events.map((event)=>event.reason),["cohort","default"]);
  assert.equal(result.failedEvents[0].reason,"dependency_failure");
});
