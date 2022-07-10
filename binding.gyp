{
  "targets": [
    {
      "target_name": "SignalChat_Native",
      "sources": [ "native/src/SignalChat_Native.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
	"native/lib",
      ],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'conditions': [
        ["OS=='win'", {
          "defines": [
            "_HAS_EXCEPTIONS=1"
          ],
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1
            },
          },
        }],
        ["OS=='mac'", {
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
            'CLANG_CXX_LIBRARY': 'libc++',
            'MACOSX_DEPLOYMENT_TARGET': '10.7',
          },
        }],
      ],
    }
  ]
}

