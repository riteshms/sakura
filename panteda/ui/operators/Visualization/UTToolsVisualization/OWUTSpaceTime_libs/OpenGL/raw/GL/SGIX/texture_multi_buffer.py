'''Autogenerated by get_gl_extensions script, do not edit!'''
from OpenGL import platform as _p
from OpenGL.GL import glget
EXTENSION_NAME = 'GL_SGIX_texture_multi_buffer'
_p.unpack_constants( """GL_TEXTURE_MULTI_BUFFER_HINT_SGIX 0x812E""", globals())


def glInitTextureMultiBufferSGIX():
    '''Return boolean indicating whether this extension is available'''
    from OpenGL import extensions
    return extensions.hasGLExtension( EXTENSION_NAME )