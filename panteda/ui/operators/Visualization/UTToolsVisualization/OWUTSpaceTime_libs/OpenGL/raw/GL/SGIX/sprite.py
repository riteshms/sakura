'''Autogenerated by get_gl_extensions script, do not edit!'''
from OpenGL import platform as _p, constants as _cs, arrays
from OpenGL.GL import glget
import ctypes
EXTENSION_NAME = 'GL_SGIX_sprite'
def _f( function ):
    return _p.createFunction( function,_p.GL,'GL_SGIX_sprite',False)
_p.unpack_constants( """GL_SPRITE_SGIX 0x8148
GL_SPRITE_MODE_SGIX 0x8149
GL_SPRITE_AXIS_SGIX 0x814A
GL_SPRITE_TRANSLATION_SGIX 0x814B
GL_SPRITE_AXIAL_SGIX 0x814C
GL_SPRITE_OBJECT_ALIGNED_SGIX 0x814D
GL_SPRITE_EYE_ALIGNED_SGIX 0x814E""", globals())
@_f
@_p.types(None,_cs.GLenum,_cs.GLfloat)
def glSpriteParameterfSGIX( pname,param ):pass
@_f
@_p.types(None,_cs.GLenum,arrays.GLfloatArray)
def glSpriteParameterfvSGIX( pname,params ):pass
@_f
@_p.types(None,_cs.GLenum,_cs.GLint)
def glSpriteParameteriSGIX( pname,param ):pass
@_f
@_p.types(None,_cs.GLenum,arrays.GLintArray)
def glSpriteParameterivSGIX( pname,params ):pass


def glInitSpriteSGIX():
    '''Return boolean indicating whether this extension is available'''
    from OpenGL import extensions
    return extensions.hasGLExtension( EXTENSION_NAME )