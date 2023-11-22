[#id](#EARTHDISTANCE)

## F.15. earthdistance — calculate great-circle distances [#](#EARTHDISTANCE)

- [F.15.1. Cube-Based Earth Distances](earthdistance#EARTHDISTANCE-CUBE-BASED)
- [F.15.2. Point-Based Earth Distances](earthdistance#EARTHDISTANCE-POINT-BASED)

The `earthdistance` module provides two different approaches to calculating great circle distances on the surface of the Earth. The one described first depends on the `cube` module. The second one is based on the built-in `point` data type, using longitude and latitude for the coordinates.

In this module, the Earth is assumed to be perfectly spherical. (If that's too inaccurate for you, you might want to look at the [PostGIS](https://postgis.net/) project.)

The `cube` module must be installed before `earthdistance` can be installed (although you can use the `CASCADE` option of `CREATE EXTENSION` to install both in one command).

### Caution

It is strongly recommended that `earthdistance` and `cube` be installed in the same schema, and that that schema be one for which CREATE privilege has not been and will not be granted to any untrusted users. Otherwise there are installation-time security hazards if `earthdistance`'s schema contains objects defined by a hostile user. Furthermore, when using `earthdistance`'s functions after installation, the entire search path should contain only trusted schemas.

[#id](#EARTHDISTANCE-CUBE-BASED)

### F.15.1. Cube-Based Earth Distances [#](#EARTHDISTANCE-CUBE-BASED)

Data is stored in cubes that are points (both corners are the same) using 3 coordinates representing the x, y, and z distance from the center of the Earth. A [\*\*](glossary#GLOSSARY-DOMAIN)_[domain](glossary#GLOSSARY-DOMAIN)_ `earth` over type `cube` is provided, which includes constraint checks that the value meets these restrictions and is reasonably close to the actual surface of the Earth.

The radius of the Earth is obtained from the `earth()` function. It is given in meters. But by changing this one function you can change the module to use some other units, or to use a different value of the radius that you feel is more appropriate.

This package has applications to astronomical databases as well. Astronomers will probably want to change `earth()` to return a radius of `180/pi()` so that distances are in degrees.

Functions are provided to support input in latitude and longitude (in degrees), to support output of latitude and longitude, to calculate the great circle distance between two points and to easily specify a bounding box usable for index searches.

The provided functions are shown in [Table F.5](earthdistance#EARTHDISTANCE-CUBE-FUNCTIONS).

[#id](#EARTHDISTANCE-CUBE-FUNCTIONS)

**Table F.5. Cube-Based Earthdistance Functions**

<table class="table" summary="Cube-Based Earthdistance Functions" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function</div>
        <p>Description</p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.25.7.7.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">earth</code> () → <code class="returnvalue">float8</code>
        </div>
        <p>Returns the assumed radius of the Earth.</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.25.7.7.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">sec_to_gc</code> ( <code class="type">float8</code> ) →
          <code class="returnvalue">float8</code>
        </div>
        <div>
          Converts the normal straight line (secant) distance between two points on the surface of
          the Earth to the great circle distance between them.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.25.7.7.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">gc_to_sec</code> ( <code class="type">float8</code> ) →
          <code class="returnvalue">float8</code>
        </div>
        <div>
          Converts the great circle distance between two points on the surface of the Earth to the
          normal straight line (secant) distance between them.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.25.7.7.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">ll_to_earth</code> ( <code class="type">float8</code>,
          <code class="type">float8</code> ) → <code class="returnvalue">earth</code>
        </div>
        <div>
          Returns the location of a point on the surface of the Earth given its latitude (argument 1) and longitude (argument 2) in degrees.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.25.7.7.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">latitude</code> ( <code class="type">earth</code> ) →
          <code class="returnvalue">float8</code>
        </div>
        <p>Returns the latitude in degrees of a point on the surface of the Earth.</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.25.7.7.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">longitude</code> ( <code class="type">earth</code> ) →
          <code class="returnvalue">float8</code>
        </div>
        <p>Returns the longitude in degrees of a point on the surface of the Earth.</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.25.7.7.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">earth_distance</code> ( <code class="type">earth</code>,
          <code class="type">earth</code> ) → <code class="returnvalue">float8</code>
        </div>
        <p>Returns the great circle distance between two points on the surface of the Earth.</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.25.7.7.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">earth_box</code> ( <code class="type">earth</code>,
          <code class="type">float8</code> ) → <code class="returnvalue">cube</code>
        </div>
        <div>
          Returns a box suitable for an indexed search using the <code class="type">cube</code>
          <code class="literal">@&gt;</code>
          operator for points within a given great circle distance of a location. Some points in
          this box are further than the specified great circle distance from the location, so a
          second check using
          <code class="function">earth_distance</code> should be included in the query.
        </div>
      </td>
    </tr>
  </tbody>
</table>

[#id](#EARTHDISTANCE-POINT-BASED)

### F.15.2. Point-Based Earth Distances [#](#EARTHDISTANCE-POINT-BASED)

The second part of the module relies on representing Earth locations as values of type `point`, in which the first component is taken to represent longitude in degrees, and the second component is taken to represent latitude in degrees. Points are taken as (longitude, latitude) and not vice versa because longitude is closer to the intuitive idea of x-axis and latitude to y-axis.

A single operator is provided, shown in [Table F.6](earthdistance#EARTHDISTANCE-POINT-OPERATORS).

[#id](#EARTHDISTANCE-POINT-OPERATORS)

**Table F.6. Point-Based Earthdistance Operators**

<table class="table" summary="Point-Based Earthdistance Operators" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <p class="func_signature">Operator</p>
        <p>Description</p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">point</code> <code class="literal">&lt;@&gt;</code>
          <code class="type">point</code> → <code class="returnvalue">float8</code>
        </div>
        <p>Computes the distance in statute miles between two points on the Earth's surface.</p>
      </td>
    </tr>
  </tbody>
</table>

Note that unlike the `cube`-based part of the module, units are hardwired here: changing the `earth()` function will not affect the results of this operator.

One disadvantage of the longitude/latitude representation is that you need to be careful about the edge conditions near the poles and near +/- 180 degrees of longitude. The `cube`-based representation avoids these discontinuities.
