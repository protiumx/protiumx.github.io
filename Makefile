.PHONY: dev cp-wasmjs

dev: cp-wasmjs
	python3 -m http.server 8000

cp-wasmjs:
ifeq (,$(wildcard ./app/wasm_exec.js))
	cp "$(shell go env GOROOT)/misc/wasm/wasm_exec.js" ./app/
endif

