'''Autogenerated by get_gl_extensions script, do not edit!'''
from OpenGL import platform as _p
from OpenGL.GL import glget
EXTENSION_NAME = 'GL_EXT_texture_swizzle'
_p.unpack_constants( """GL_TEXTURE_SWIZZLE_R_EXT 0x8E42
GL_TEXTURE_SWIZZLE_G_EXT 0x8E43
GL_TEXTURE_SWIZZLE_B_EXT 0x8E44
GL_TEXTURE_SWIZZLE_A_EXT 0x8E45
GL_TEXTURE_SWIZZLE_RGBA_EXT 0x8E46""", globals())


def glInitTextureSwizzleEXT():
    '''Return boolean indicating whether this extension is available'''
    from OpenGL import extensions
    return extensions.hasGLExtension( EXTENSION_NAME )