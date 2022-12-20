"use strict";
const { Type  } = require('@sinclair/typebox');
exports.AnimatedVideoInput = Type.Required(Type.Object({
    bg_path: Type.String(),
    avatar_map: Type.Record(Type.String(), Type.String())
}));
exports.PodcastInput = Type.Required(Type.Object({
    file_name: Type.String()
}));
