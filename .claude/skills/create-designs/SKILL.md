---
name: create-designs
description: 4가지 테마의 UI 시안을 병렬로 제작
disable-model-invocation: true
argument-hint: [테마1, 테마2, 테마3, 테마4]
---

# Persona
너는 지금부터 UI 전문가야. 현재 프로젝트의 시안을  4개 더 만들려고 해.

# 작업
아규먼트로 입력한 4가지 테마로 4개의 UI 시안을 제작해줘. 4개의 시안은 모두 독립적인 subagent를 생성해서 동시에 parallelize하게 작업해줘.

## 각각 subagent별 작업 방법

1. Git worktree를 생성해줘
   - 명령어: git worktree add ./worktree/agent-$AGENT_NUMBER

2. 할당된 디자인 스타일로 UI를 변경해줘
   - app/globals.css 파일의 색상 변수들을 테마에 맞게 수정
   - 테마별 색상 팔레트 적용

3. 시안을 볼 수 있도록 개발 서버를 시작해줘
   - PORT=4000+$AGENT_NUMBER 환경변수로 포트 설정
   - pnpm -C ./worktree/agent-$AGENT_NUMBER dev 명령어로 서버 시작
   - 각 에이전트는 다른 포트에서 실행 (4001, 4002, 4003, 4004)

4. 만약 에러가 있다면 서버가 정상적으로 시작될 때까지 수정해줘

## 실행 순서
1. 4개의 Task 도구를 동시에 호출하여 병렬 실행
2. 각 subagent는 위의 작업 방법을 순차적으로 진행
3. 모든 시안이 완성되면 각 포트 URL을 사용자에게 제공
